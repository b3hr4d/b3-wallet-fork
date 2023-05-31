import { HttpAgent, Identity } from "@dfinity/agent"
import {
  b3_system,
  canisterId,
  createActor as createSystemActor,
} from "./declarations/b3_system"
import {
  b3_wallet,
  createActor as createUserActor,
} from "./declarations/b3_wallet"

export function getHttpAgent(identity: Identity) {
  return new HttpAgent({
    host: process.env.NEXT_PUBLIC_IC_HOST,
    identity,
  })
}

export function makeB3WalletActor(canisterId: string, identity: Identity) {
  const agent = getHttpAgent(identity)

  console.log("makeB3UserActor", canisterId, agent)
  return createUserActor(canisterId, {
    agent,
  })
}

export function makeB3SystemActor(identity: Identity) {
  const agent = getHttpAgent(identity)

  return createSystemActor(canisterId, {
    agent,
  })
}

export type B3Wallet = typeof b3_wallet

export type B3System = typeof b3_system
