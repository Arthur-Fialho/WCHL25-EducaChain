import Curves "mo:bitcoin/ec/Curves";

module {
    public type SendRequest = {
        destination_address : Text;
        amount_in_satoshi : Satoshi;
    };

    public type ECDSAPublicKeyReply = {
        public_key : Blob;
        chain_code : Blob;
    };

    public type EcdsaKeyId = {
        curve : EcdsaCurve;
        name : Text;
    };

    public type EcdsaCurve = {
        #secp256k1;
    };

    public type SignWithECDSAReply = {
        signature : Blob;
    };

    public type ECDSAPublicKey = {
        canister_id : ?Principal;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type SignWithECDSA = {
        message_hash : Blob;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type Satoshi = Nat64;
    public type MillisatoshiPerVByte = Nat64;
    public type Cycles = Nat;
    public type BitcoinAddress = Text;
    public type BlockHash = [Nat8];
    public type Page = [Nat8];

    public let CURVE = Curves.secp256k1;

    public type Network = {
        #mainnet;
        #testnet;
        #regtest;
    };

    public type NetworkCamelCase = {
        #Mainnet;
        #Testnet;
        #Regtest;
    };

    public func network_to_network_camel_case(network : Network) : NetworkCamelCase {
        switch (network) {
            case (#regtest) { #Regtest; };
            case (#testnet) { #Testnet; };
            case (#mainnet) { #Mainnet; };
        };
    };

    public type OutPoint = {
        txid : Blob;
        vout : Nat32;
    };

    public type Utxo = {
        outpoint : OutPoint;
        value : Satoshi;
        height : Nat32;
    };

    public type GetUtxosResponse = {
        utxos : [Utxo];
        tip_block_hash : BlockHash;
        tip_height : Nat32;
        next_page : ?Page;
    };

    public type UtxosFilter = {
        #MinConfirmations : Nat32;
        #Page : Page;
    };

    public type EcdsaSignFunction = (EcdsaCanisterActor, Text, [Blob], Blob) -> async Blob;

    public type EcdsaCanisterActor = actor {
        ecdsa_public_key : ECDSAPublicKey -> async ECDSAPublicKeyReply;
        sign_with_ecdsa : SignWithECDSA -> async SignWithECDSAReply;
    };
}
