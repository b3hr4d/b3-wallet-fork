import { Button, Container, Stack, Text } from "@chakra-ui/react"
import Wallet from "components/Account"
import Disclaimer from "components/Disclaimer"
import { Footer } from "components/Footer"
import Header from "components/Header"
import Loading from "components/Loading"
import SystemCanister from "components/SystemCanister"
import useAuthClient from "hooks/useAuthClient"
import { useCallback, useState } from "react"
import { B3Wallet, makeB3WalletActor } from "service/actor"

function App() {
  const {
    isAuthenticated,
    isAuthenticating,
    authClient,
    login,
    logout,
    systemActor,
  } = useAuthClient()

  const [loading, setLoading] = useState(false)
  const [walletCanisterId, setWalletCanisterId] = useState<string>("")
  const [walletActor, setWalletActor] = useState<B3Wallet>()
  const [version, setVersion] = useState<string>("")

  const fetchUserActor = useCallback(
    async (canisterId: string) => {
      if (!authClient || !canisterId) return
      setWalletCanisterId(canisterId)

      const userActor = makeB3WalletActor(canisterId, authClient.getIdentity())

      console.log("fetching user actor")
      setLoading(true)

      userActor
        .version()
        .then(async (version) => {
          console.log("user actor version", version)
          setVersion(version)
          setWalletActor(userActor)

          setLoading(false)
        })
        .catch((e) => {
          console.log(e)
          setWalletCanisterId("")
          setLoading(false)
        })
    },
    [authClient]
  )

  return (
    <Container maxW="2xl" p={0}>
      <Header />
      <Stack
        as="main"
        p={4}
        my={2}
        bg="white"
        bgColor="gray.50"
        minH="20vh"
        boxShadow="md"
        borderRadius="md"
        position="relative"
        justify="space-between"
      >
        {isAuthenticating && <Loading title="Authenticating" />}
        {loading && <Loading title="Loading Wallet" />}
        {isAuthenticated ? (
          walletActor ? (
            <Wallet
              actor={walletActor}
              walletCanisterId={walletCanisterId}
              version={version}
            />
          ) : systemActor ? (
            <SystemCanister
              systemActor={systemActor}
              fetchUserActor={fetchUserActor}
            />
          ) : (
            <Loading dark title="Fetching" />
          )
        ) : (
          <Stack spacing="4">
            <Disclaimer noTitle />
            <Text>Connect your wallet to get started</Text>
            <Button onClick={login} colorScheme="green">
              Login
            </Button>
          </Stack>
        )}
        {isAuthenticated && (
          <Stack borderTop="1px solid #eee" pt={4}>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => {
                logout()
                window.location.reload()
              }}
            >
              Logout
            </Button>
          </Stack>
        )}
      </Stack>
      <Footer />
    </Container>
  )
}

export default App
