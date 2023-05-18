use enum_dispatch::enum_dispatch;
use ic_cdk::export::{candid::CandidType, serde::Deserialize};

use crate::{error::WalletError, types::SignedMessage};

use super::Request;

#[enum_dispatch]
#[derive(CandidType, Clone, Deserialize, Debug, PartialEq)]
pub enum BtcRequest {
    BtcTransferRequest,
}

impl BtcRequest {
    pub async fn execute(&self) -> Result<SignedMessage, WalletError> {
        match self {
            BtcRequest::BtcTransferRequest(args) => args.execute().await,
        }
    }
}

#[derive(CandidType, Clone, Deserialize, Debug, PartialEq)]
pub struct BtcTransferRequest {
    pub amount: u64,
    pub address: String,
    pub deadline: u64,
}

impl From<BtcTransferRequest> for Request {
    fn from(args: BtcTransferRequest) -> Self {
        Request::BtcRequest(BtcRequest::BtcTransferRequest(args))
    }
}

impl BtcTransferRequest {
    pub async fn execute(&self) -> Result<SignedMessage, WalletError> {
        Ok(SignedMessage::default())
    }
}
