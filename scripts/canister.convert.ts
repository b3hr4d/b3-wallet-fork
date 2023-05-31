const base32Decode = require("base32-decode")
const crc32 = require("buffer-crc32")

function toArrayBuffer(arrayBuffer) {
  // Convert ArrayBuffer to Uint8Array
  let uint8Array = new Uint8Array(arrayBuffer)

  // Convert Uint8Array to Array of bytes
  let byteArray = Array.from(uint8Array)

  return byteArray
}

function principalToBytes(principal: string) {
  console.log("Principal: " + principal)
  // Remove dashes and convert to uppercase
  let sanitized = principal.replace(/-/g, "").toUpperCase()

  // Decode from base32
  let decoded = base32Decode(sanitized, "RFC4648")

  // Verify the CRC32 checksum
  let checksum = decoded.slice(0, 4)
  let data = decoded.slice(4)

  let checksumBuffer = Buffer.from(checksum)
  let checksumNumber = checksumBuffer.readUInt32BE(0)

  if (crc32.unsigned(Buffer.from(data)) !== checksumNumber) {
    throw new Error("Invalid checksum")
  }

  let byteArray = toArrayBuffer(data)

  console.log(byteArray)

  return data
}

const canisterId = process.argv[2] as string

principalToBytes(canisterId)
