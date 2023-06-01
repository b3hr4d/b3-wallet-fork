import { ReleaseArgs } from "../frontend/declarations/b3_system/b3_system.did"
import { B3System } from "../frontend/system/service/actor"
import { systemICActor, systemLocalActor } from "./actor"
import { chunkGenerator, loadWasm, readVersion } from "./utils"

const loadRelease = async (
  actor: B3System,
  wasmModule: number[],
  version: string
) => {
  console.log(`Wasm size:`, wasmModule.length)

  const release: ReleaseArgs = {
    version,
    features: [["", ""]],
    size: BigInt(wasmModule.length),
  }

  for await (const chunks of chunkGenerator(wasmModule)) {
    const result = await actor.load_release(chunks, release)

    console.log(`Chunks :`, result)
  }

  console.log(`Loading done.`)
}

export const load = async (actor: B3System, reload?: boolean) => {
  const wasmModule = await loadWasm()
  const version = await readVersion()

  if (!version) {
    console.error(`Version for wasm cannot be read.`)
    return
  }

  if (reload) {
    console.log(`Reloading wasm code v${version} in System.`)

    await actor.remove_release(version)
  } else {
    console.log(`Loading wasm code v${version} in System.`)
  }

  await loadRelease(actor, wasmModule, version)

  // loading candid version
  const wasmModuleCandid = await loadWasm(true)
  console.log(`Loading wasm code with candid v${version}-candid in System.`)
  await loadRelease(actor, wasmModuleCandid, version + "-candid")
}

const loader = async (
  reload?: boolean,
  network?: string,
  canisterId?: string
) => {
  let actor =
    network === "ic"
      ? await systemICActor(canisterId)
      : await systemLocalActor(canisterId)

  await load(actor, reload)
}

let canisterId: string | undefined
let network: string | undefined
let reload: boolean = false

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i].startsWith("--network=")) {
    network = process.argv[i].split("=")[1]
  } else if (process.argv[i] === "--reload") {
    reload = true
  } else if (!process.argv[i].startsWith("--")) {
    canisterId = process.argv[i]
  }
}

console.log(`Canister ID: ${canisterId}`) // Outputs: 'renrk-eyaaa-aaaaa-aaada-cai' if you ran: ts-node main.ts renrk-eyaaa-aaaaa-aaada-cai --network=ic --reload
console.log(`Network: ${network}`) // Outputs: 'ic' if you ran: ts-node main.ts renrk-eyaaa-aaaaa-aaada-cai --network=ic --reload
console.log(`Reload: ${reload}`) // Outputs: 'true' if you ran: ts-node main.ts renrk-eyaaa-aaaaa-aaada-cai --network=ic --reload

loader(reload, network, canisterId)
