use crate::types::{CanisterId, Memo, Tokens};

pub const RATE_LIMIT: u64 = 60000000000;

pub const IC_TRANSACTION_FEE_ICP: Tokens = Tokens::from_e8s(10_000);

pub const CREATE_SIGNER_CANISTER_CYCLES: u128 = 1_000_000_000_000;

pub const CANISTER_CREATE_MEMO: Memo = Memo(0x41455243);

pub const CANISTER_TOP_UP_MEMO: Memo = Memo(0x50555054);

pub const CANISTER_TRANSFER_MEMO: Memo = Memo(0x544153);

pub const MANAGMENT_CANISTER_ID: CanisterId = CanisterId::management_canister();

// ryjl3-tyaaa-aaaaa-aaaba-cai
pub const LEDGER_ID: [u8; 10] = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01, 0x01];

pub const LEDGER_CANISTER_ID: CanisterId = CanisterId::from_slice(&LEDGER_ID);

// rkp4c-7iaaa-aaaaa-aaaca-cai
pub const CMC_ID: [u8; 10] = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x01, 0x01];

pub const CYCLES_MINTING_CANISTER_ID: CanisterId = CanisterId::from_slice(&CMC_ID);

pub const GET_BALANCE_COST_CYCLES: u64 = 100_000_000;

pub const GET_UTXOS_COST_CYCLES: u64 = 10_000_000_000;

pub const GET_CURRENT_FEE_PERCENTILES_CYCLES: u64 = 100_000_000;

pub const SEND_TRANSACTION_BASE_CYCLES: u64 = 5_000_000_000;

pub const SEND_TRANSACTION_PER_BYTE_CYCLES: u64 = 20_000_000;
