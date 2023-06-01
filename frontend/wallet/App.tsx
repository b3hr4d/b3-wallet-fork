import { Button, Card, Container, Stack } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import Disclaimer from "wallet/components/Disclaimer"
import { Footer } from "wallet/components/Footer"
import Header from "wallet/components/Header"
import Loading from "wallet/components/Loading"
import Wallet from "wallet/components/Wallet"
import { getCanisterId } from "wallet/helpers/utiles"
import useAuthClient from "wallet/hooks/useAuthClient"
import { B3Wallet, makeB3WalletActor } from "wallet/service/actor"

function App() {
  const { isAuthenticated, isAuthenticating, authClient, login, logout } =
    useAuthClient()

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

  useEffect(() => {
    if (!authClient) return

    if (isAuthenticated) {
      const canisterId = getCanisterId()
      console.log("canisterId", canisterId)
      fetchUserActor(canisterId)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authClient, isAuthenticated])

  return (
    <Container maxW="2xl" p={0}>
      <Header />
      <Stack
        as="main"
        p={4}
        my={2}
        bg="white"
        bgColor="gray.50"
        minH="100px"
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
          ) : (
            <Loading title="Fetching" />
          )
        ) : (
          <Stack spacing="4">
            <Disclaimer noTitle />
            <Button onClick={login} colorScheme="green">
              Login
            </Button>
          </Stack>
        )}
      </Stack>
      {isAuthenticated && (
        <Card p={2}>
          <Stack spacing="4">
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
        </Card>
      )}
      <Footer />
    </Container>
  )
}

export default App
