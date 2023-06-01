import { HttpAgent, Identity } from "@dfinity/agent"
import {
  b3_system,
  canisterId,
  createActor as createSystemActor,
} from "declarations/b3_system"
import { IC_URL } from "system/helpers/constants"

export function getHttpAgent(identity: Identity) {
  return new HttpAgent({
    host: IC_URL,
    identity,
  })
}

export function makeB3SystemActor(identity: Identity) {
  const agent = getHttpAgent(identity)

  return createSystemActor(canisterId, {
    agent,
  })
}

export type B3System = typeof b3_system
