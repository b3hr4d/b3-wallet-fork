import { Actor, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { readFileSync } from "fs"
import { idlFactory as systemFactory } from "../frontend/declarations/b3_system"
import { idlFactory as userFactory } from "../frontend/declarations/b3_wallet"
import { B3System } from "../frontend/system/service/actor"
import { B3Wallet } from "../frontend/wallet/service/actor"
import { initIdentity } from "./utils"

// PRINCIPALS -----------------------------------------------------------------
const systemPrincipalLocal = () => {
  const buffer = readFileSync("./.dfx/local/canister_ids.json")
  const { b3_system } = JSON.parse(buffer.toString("utf-8"))
  return Principal.fromText(b3_system.local)
}

const walletPrincipalLocal = () => {
  const buffer = readFileSync("./.dfx/local/canister_ids.json")
  const { b3_wallet } = JSON.parse(buffer.toString("utf-8"))
  return Principal.fromText(b3_wallet.local)
}

const systemPrincipalIC = () => {
  const buffer = readFileSync("./canister_ids.json")
  const { b3_system } = JSON.parse(buffer.toString("utf-8"))
  return Principal.fromText(b3_system.ic)
}

const walletPrincipalIC = () => {
  const buffer = readFileSync("./.dfx/local/canister_ids.json")
  const { b3_wallet } = JSON.parse(buffer.toString("utf-8"))
  return Principal.fromText(b3_wallet.ic)
}

// AGENTS ----------------------------------------------------------------------
export const icAgent = () => {
  const identity = initIdentity(true)

  // @ts-ignore
  return new HttpAgent({ identity, host: "https://icp0.io" })
}

export const localAgent = async () => {
  const identity = initIdentity(false)

  const agent = new HttpAgent({
    // @ts-ignore
    identity,
    host: "http://127.0.0.1:8080/",
  })

  await agent.fetchRootKey()

  return agent
}

// ACTORS ----------------------------------------------------------------------
export const systemICActor = async (canister_address?: string) => {
  const canisterId = canister_address
    ? Principal.fromText(canister_address)
    : systemPrincipalIC()

  const agent = icAgent()

  return Actor.createActor(systemFactory, {
    agent,
    canisterId,
  }) as Promise<B3System>
}

export const walletICActor = async (canister_address?: string) => {
  const canisterId = canister_address
    ? Principal.fromText(canister_address)
    : walletPrincipalIC()

  const agent = icAgent()

  return Actor.createActor(userFactory, {
    agent,
    canisterId,
  }) as Promise<B3Wallet>
}

export const systemLocalActor = async (canister_address?: string) => {
  const canisterId = canister_address
    ? Principal.fromText(canister_address)
    : systemPrincipalLocal()

  const agent = await localAgent()

  return Actor.createActor(systemFactory, {
    agent,
    canisterId,
  }) as Promise<B3System>
}

export const walletLocalActor = async (canister_address?: string) => {
  const canisterId = canister_address
    ? Principal.fromText(canister_address)
    : walletPrincipalLocal()

  const agent = await localAgent()

  return Actor.createActor(userFactory, {
    agent,
    canisterId,
  }) as Promise<B3Wallet>
}
