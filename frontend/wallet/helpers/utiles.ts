export const getHostFromUrl = (hostUrl: string) => {
  try {
    const url = new URL(hostUrl)
    return url.host
  } catch (error) {
    return ""
  }
}

export const getCanisterId = (): string => {
  // Check the query params.
  const maybeCanisterId = new URLSearchParams(window.location.search).get(
    "canisterId"
  )
  if (maybeCanisterId) {
    return maybeCanisterId
  }

  // Return the first canister ID when resolving from the right hand side.
  const domain = window.location.hostname.split(".").reverse()
  for (const subdomain of domain) {
    try {
      if (subdomain.length >= 25) {
        // The following throws if it can't decode or the checksum is invalid.
        return subdomain
      }
    } catch (_) {}
  }

  throw new Error("Could not find the canister ID.")
}
