import { B3Wallet } from "../frontend/wallet/service/actor"
import { walletICActor, walletLocalActor } from "./actor"
import { chunkGenerator, loadWasm, readVersion } from "./utils"

const resetRelease = (actor: B3Wallet) => actor.unload_wasm()

const loadRelease = async (
  actor: B3Wallet,
  wasmModule: number[],
  version: string
) => {
  console.log(`Loading wasm code ${version} in User Canister.`)

  console.log(`Wasm size:`, wasmModule.length)

  for await (const chunks of chunkGenerator(wasmModule)) {
    const result = await actor.load_wasm(chunks)
    console.log(`Chunks :`, result)
  }

  console.log(`Loading done.`)
}

const load = async (actor: B3Wallet) => {
  const wasmModule = await loadWasm()
  const version = await readVersion()

  if (!version) {
    console.error(`Version for wasm cannot be read.`)
    return
  }

  await resetRelease(actor)
  await loadRelease(actor, wasmModule, version)
}

const loader = async (canisterId?: string, network?: string) => {
  if (canisterId) {
    console.log(`Start Loading on Canister ID:`, canisterId)
  }
  let actor =
    network === "ic"
      ? await walletICActor(canisterId)
      : await walletLocalActor(canisterId)

  await load(actor)
}

// main.ts
let canisterId: string | undefined
let network: string | undefined

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i].startsWith("--network=")) {
    network = process.argv[i].split("=")[1]
  } else if (!process.argv[i].startsWith("--")) {
    canisterId = process.argv[i]
  }
}

console.log(`Canister ID: ${canisterId}`) // Outputs: 'renrk-eyaaa-aaaaa-aaada-cai' if you ran: ts-node main.ts renrk-eyaaa-aaaaa-aaada-cai --network=ic
console.log(`Network: ${network}`) // Outputs: 'ic' if you ran: ts-node main.ts renrk-eyaaa-aaaaa-aaada-cai --network=ic

loader(canisterId, network)
