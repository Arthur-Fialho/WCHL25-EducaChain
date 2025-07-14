import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import InlinedTypes "InlinedTypes";

module {
    type Result<Ok, Err> = Result.Result<Ok, Err>;
    type EcdsaCanisterActor = InlinedTypes.EcdsaCanisterActor;

    public func get_ok<T>(result : Result<T, Text>) : T {
        switch result {
            case (#ok value) value;
            case (#err error) Debug.trap("pattern failed: " # error);
        };
    };

    public func get_ok_expect<T>(result : Result<T, Text>, expect : Text) : T {
        switch result {
            case (#ok value) value;
            case (#err error) {
                Debug.trap(expect # " pattern failed: " # error);
            };
        };
    };

    public func unwrap<T>(option : ?T) : T {
        switch option {
            case (?value) value;
            case null Prelude.unreachable();
        };
    };

    func nat4ToText(nat4 : Nat8) : Text {
        Text.fromChar(
            switch nat4 {
                case 0 '0'; case 1 '1'; case 2 '2'; case 3 '3'; case 4 '4';
                case 5 '5'; case 6 '6'; case 7 '7'; case 8 '8'; case 9 '9';
                case 10 'a'; case 11 'b'; case 12 'c'; case 13 'd'; case 14 'e';
                case 15 'f'; case _ Prelude.unreachable();
            }
        );
    };

    func nat8ToText(byte : Nat8) : Text {
        let leftNat4 = byte >> 4;
        let rightNat4 = byte & 15;
        nat4ToText(leftNat4) # nat4ToText(rightNat4);
    };

    public func bytesToText(bytes : [Nat8]) : Text {
        Text.join("", Iter.map<Nat8, Text>(Iter.fromArray(bytes), func(n) { nat8ToText(n) }));
    };

    public func ecdsa_mock_signer(_ecdsa_canister_actor : EcdsaCanisterActor, _key_name : Text, _derivation_path : [Blob], _message_hash : Blob) : async Blob {
        Blob.fromArray(Array.freeze(Array.init<Nat8>(64, 255)));
    };
}
