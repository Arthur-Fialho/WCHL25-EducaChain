import ExperimentalCycles "mo:base/ExperimentalCycles";
import Blob "mo:base/Blob";

import InlinedTypes "InlinedTypes";

module {
    type ECDSAPublicKey = InlinedTypes.ECDSAPublicKey;
    type ECDSAPublicKeyReply = InlinedTypes.ECDSAPublicKeyReply;
    type SignWithECDSA = InlinedTypes.SignWithECDSA;
    type SignWithECDSAReply = InlinedTypes.SignWithECDSAReply;
    type Cycles = InlinedTypes.Cycles;
    type EcdsaCanisterActor = InlinedTypes.EcdsaCanisterActor;

    let SIGN_WITH_ECDSA_COST_CYCLES : Cycles = 10_000_000_000;

    public func ecdsa_public_key(ecdsa_canister_actor: EcdsaCanisterActor, key_name : Text, derivation_path : [Blob]) : async Blob {
        let res = await ecdsa_canister_actor.ecdsa_public_key({
            canister_id = null;
            derivation_path;
            key_id = { curve = #secp256k1; name = key_name; };
        });
        res.public_key;
    };

    public func sign_with_ecdsa(ecdsa_canister_actor: EcdsaCanisterActor, key_name : Text, derivation_path : [Blob], message_hash : Blob) : async Blob {
        ExperimentalCycles.add<system>(SIGN_WITH_ECDSA_COST_CYCLES);
        let res = await ecdsa_canister_actor.sign_with_ecdsa({
            message_hash;
            derivation_path;
            key_id = { curve = #secp256k1; name = key_name; };
        });
        res.signature;
    };
}
