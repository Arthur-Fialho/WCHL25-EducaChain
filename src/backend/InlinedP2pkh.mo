import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

import Address "mo:bitcoin/bitcoin/Address";
import Bitcoin "mo:bitcoin/bitcoin/Bitcoin";
import Script "mo:bitcoin/bitcoin/Script";
import Transaction "mo:bitcoin/bitcoin/Transaction";
import EcdsaTypes "mo:bitcoin/ecdsa/Types";
import Publickey "mo:bitcoin/ecdsa/Publickey";
import Der "mo:bitcoin/ecdsa/Der";
import Affine "mo:bitcoin/ec/Affine";
import P2pkhLib "mo:bitcoin/bitcoin/P2pkh"; // Added import

import InlinedBitcoinApi "InlinedBitcoinApi";
import InlinedEcdsaApi "InlinedEcdsaApi";
import InlinedTypes "InlinedTypes";
import InlinedUtils "InlinedUtils";

module {
    type Result<Ok, Err> = Result.Result<Ok, Err>;
    type Network = InlinedTypes.Network;
    type BitcoinAddress = InlinedTypes.BitcoinAddress;
    type Satoshi = InlinedTypes.Satoshi;
    type Utxo = InlinedTypes.Utxo;
    type MillisatoshiPerVByte = InlinedTypes.MillisatoshiPerVByte;
    type Transaction = Transaction.Transaction;
    type Script = Script.Script;
    type SighashType = Nat32;
    type EcdsaCanisterActor = InlinedTypes.EcdsaCanisterActor;

    let SIGHASH_ALL : SighashType = 0x01;

    public func get_address(ecdsa_canister_actor : EcdsaCanisterActor, network : Network, key_name : Text, derivation_path : [[Nat8]]) : async BitcoinAddress {
        let public_key = await InlinedEcdsaApi.ecdsa_public_key(ecdsa_canister_actor, key_name, Array.map(derivation_path, Blob.fromArray));
        public_key_to_p2pkh_address(network, Blob.toArray(public_key));
    };

    public func send(ecdsa_canister_actor : EcdsaCanisterActor, network : Network, derivation_path : [[Nat8]], key_name : Text, dst_address : BitcoinAddress, amount : Satoshi) : async Blob { // Changed return type to Blob
        let fee_percentiles = await InlinedBitcoinApi.get_current_fee_percentiles(network);

        let fee_per_vbyte : MillisatoshiPerVByte = if (fee_percentiles.size() == 0) { 2000; } else { fee_percentiles[50]; };

        let own_public_key = Blob.toArray(await InlinedEcdsaApi.ecdsa_public_key(ecdsa_canister_actor, key_name, Array.map(derivation_path, Blob.fromArray)));
        let own_address = public_key_to_p2pkh_address(network, own_public_key);

        let own_utxos = (await InlinedBitcoinApi.get_utxos(network, own_address)).utxos;

        let tx_bytes = await build_transaction(ecdsa_canister_actor, own_public_key, own_address, own_utxos, dst_address, amount, fee_per_vbyte);
        let transaction : Transaction.Transaction = InlinedUtils.get_ok(Transaction.fromBytes(Iter.fromArray(tx_bytes)));

        let signed_transaction_bytes = await sign_transaction(ecdsa_canister_actor, own_public_key, own_address, transaction, key_name, Array.map(derivation_path, Blob.fromArray), InlinedEcdsaApi.sign_with_ecdsa);

        Debug.print("Sending transaction");
        await InlinedBitcoinApi.send_transaction(network, signed_transaction_bytes);

        let transaction_iter : Iter.Iter<Nat8> = Iter.fromArray(signed_transaction_bytes);
        let parsed_transaction_result : Result<Transaction.Transaction, Text> = Transaction.fromBytes(transaction_iter);

        switch (parsed_transaction_result) {
            case (#ok tx) {
                let tx_id_blob : Blob = Blob.fromArray(tx.txid()); // Forçando a conversão para Blob
                return tx_id_blob;
            };
            case (#err msg) {
                Debug.trap("Failed to parse transaction bytes after signing: " # msg);
            };
        };
    };

    func build_transaction(
        ecdsa_canister_actor : EcdsaCanisterActor,
        own_public_key : [Nat8],
        own_address : BitcoinAddress,
        own_utxos : [Utxo],
        dst_address : BitcoinAddress,
        amount : Satoshi,
        fee_per_vbyte : MillisatoshiPerVByte,
    ) : async [Nat8] {
        let dst_address_typed = InlinedUtils.get_ok_expect(Address.addressFromText(dst_address), "failed to decode destination address");

        let fee_per_vbyte_nat = Nat64.toNat(fee_per_vbyte);
        Debug.print("Building transaction...");
        var total_fee : Nat = 0;
        loop {
            let transaction = InlinedUtils.get_ok_expect(Bitcoin.buildTransaction(2, own_utxos, [(dst_address_typed, amount)], #p2pkh own_address, Nat64.fromNat(total_fee)), "Error building transaction.");

            let signed_transaction_bytes = await sign_transaction(
                ecdsa_canister_actor,
                own_public_key,
                own_address,
                transaction,
                "", // mock key name
                [], // mock derivation path
                InlinedUtils.ecdsa_mock_signer,
            );

            let signed_tx_bytes_len : Nat = signed_transaction_bytes.size();

            if ((signed_tx_bytes_len * fee_per_vbyte_nat) / 1000 == total_fee) {
                Debug.print("Transaction built with fee " # debug_show (total_fee));
                return transaction.toBytes();
            } else {
                total_fee := (signed_tx_bytes_len * fee_per_vbyte_nat) / 1000;
            };
        };
    };

    func sign_transaction(
        ecdsa_canister_actor : EcdsaCanisterActor,
        own_public_key : [Nat8],
        own_address : BitcoinAddress,
        transaction : Transaction,
        key_name : Text,
        derivation_path : [Blob],
        signer : InlinedTypes.EcdsaSignFunction,
    ) : async [Nat8] {
        switch (Address.scriptPubKey(#p2pkh own_address)) {
            case (#ok scriptPubKey) {
                let scriptSigs = Array.init<Script.Script>(transaction.txInputs.size(), []);

                for (i in Iter.range(0, transaction.txInputs.size() - 1)) {
                    let sighash = transaction.createP2pkhSignatureHash(
                        scriptPubKey,
                        Nat32.fromIntWrap(i),
                        SIGHASH_ALL,
                    );

                    let signature_sec = await signer(ecdsa_canister_actor, key_name, derivation_path, Blob.fromArray(sighash));
                    let signature_der = Blob.toArray(Der.encodeSignature(signature_sec));

                    let encodedSignatureWithSighashType = Array.tabulate<Nat8>(
                        signature_der.size() + 1,
                        func(n) {
                            if (n < signature_der.size()) { signature_der[n]; } else { Nat8.fromNat(Nat32.toNat(SIGHASH_ALL)); };
                        },
                    );

                    let script = [ #data encodedSignatureWithSighashType, #data own_public_key, ];
                    scriptSigs[i] := script;
                };
                for (i in Iter.range(0, scriptSigs.size() - 1)) {
                    transaction.txInputs[i].script := scriptSigs[i];
                };
            };
            case (#err msg) Debug.trap("This example supports signing p2pkh addresses only: " # msg);
        };
        transaction.toBytes();
    };

    func public_key_to_p2pkh_address(network : Network, public_key_bytes : [Nat8]) : BitcoinAddress {
        let public_key = public_key_bytes_to_public_key(public_key_bytes);
        P2pkhLib.deriveAddress(InlinedTypes.network_to_network_camel_case(network), Publickey.toSec1(public_key, true)); // Corrected call
    };

    func public_key_bytes_to_public_key(public_key_bytes : [Nat8]) : EcdsaTypes.PublicKey {
        let point = InlinedUtils.unwrap(Affine.fromBytes(public_key_bytes, InlinedTypes.CURVE));
        InlinedUtils.get_ok(Publickey.decode(#point point));
    };
}