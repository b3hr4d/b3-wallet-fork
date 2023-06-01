import { HttpAgent, Identity } from "@dfinity/agent"
import { b3_wallet, createActor } from "declarations/b3_wallet"
import { IC_URL } from "wallet/helpers/config"

export function getHttpAgent(identity: Identity) {
  return new HttpAgent({
    host: IC_URL,
    identity,
  })
}

export function makeB3WalletActor(canisterId: string, identity: Identity) {
  const agent = getHttpAgent(identity)

  console.log("makeB3UserActor", canisterId, agent)
  return createActor(canisterId, {
    agent,
  })
}

export type B3Wallet = typeof b3_wallet
