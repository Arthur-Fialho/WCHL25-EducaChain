import ExperimentalCycles "mo:base/ExperimentalCycles";

import InlinedTypes "InlinedTypes";

public type Utxo = {
    outpoint: OutPoint;
    value : Satoshi;
    height : Nat32;
};

module {
    type Cycles = InlinedTypes.Cycles;
    type Satoshi = InlinedTypes.Satoshi;
    type Network = InlinedTypes.Network;
    type BitcoinAddress = InlinedTypes.BitcoinAddress;
    type GetUtxosResponse = InlinedTypes.GetUtxosResponse;
    type MillisatoshiPerVByte = InlinedTypes.MillisatoshiPerVByte;

    type GetBalanceRequest = { address : BitcoinAddress; network : Network; min_confirmations : ?Nat32; };
    type GetUtxosRequest = { address : BitcoinAddress; network : Network; filter : ?InlinedTypes.UtxosFilter; };
    type GetCurrentFeePercentilesRequest = { network : Network; };
    type SendTransactionRequest = { transaction : [Nat8]; network : Network; };

    let GET_BALANCE_COST_CYCLES : Cycles = 100_000_000;
    let GET_UTXOS_COST_CYCLES : Cycles = 10_000_000_000;
    let GET_CURRENT_FEE_PERCENTILES_COST_CYCLES : Cycles = 100_000_000;
    let SEND_TRANSACTION_BASE_COST_CYCLES : Cycles = 5_000_000_000;
    let SEND_TRANSACTION_COST_CYCLES_PER_BYTE : Cycles = 20_000_000;

    type ManagementCanisterActor = actor {
        bitcoin_get_balance : GetBalanceRequest -> async Satoshi;
        bitcoin_get_utxos : GetUtxosRequest -> async GetUtxosResponse;
        bitcoin_get_current_fee_percentiles : GetCurrentFeePercentilesRequest -> async [MillisatoshiPerVByte];
        bitcoin_send_transaction : SendTransactionRequest -> async ();
    };

    let management_canister_actor : ManagementCanisterActor = actor("aaaaa-aa");

    public func get_balance(network : Network, address : BitcoinAddress) : async Satoshi {
        ExperimentalCycles.add<system>(GET_BALANCE_COST_CYCLES);
        await management_canister_actor.bitcoin_get_balance({ address; network; min_confirmations = null; })
    };

    public func get_utxos(network : Network, address : BitcoinAddress) : async GetUtxosResponse {
        ExperimentalCycles.add<system>(GET_UTXOS_COST_CYCLES);
        await management_canister_actor.bitcoin_get_utxos({ address; network; filter = null; })
    };

    public func get_current_fee_percentiles(network : Network) : async [MillisatoshiPerVByte] {
        ExperimentalCycles.add<system>(GET_CURRENT_FEE_PERCENTILES_COST_CYCLES);
        await management_canister_actor.bitcoin_get_current_fee_percentiles({ network; })
    };

    public func send_transaction(network : Network, transaction : [Nat8]) : async () {
        let transaction_fee = SEND_TRANSACTION_BASE_COST_CYCLES + transaction.size() * SEND_TRANSACTION_COST_CYCLES_PER_BYTE;
        ExperimentalCycles.add<system>(transaction_fee);
        await management_canister_actor.bitcoin_send_transaction({ network; transaction; })
    };
}