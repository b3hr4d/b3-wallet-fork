import { Button, Card, Container, Stack, Text } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import CanisterLink from "system/components/CanisterLink"
import Disclaimer from "system/components/Disclaimer"
import { Footer } from "system/components/Footer"
import Header from "system/components/Header"
import Loading from "system/components/Loading"
import SystemCanister from "system/components/SystemCanister"
import useAuthClient from "system/hooks/useAuthClient"
import { makeB3WalletActor } from "wallet/service/actor"

function App() {
  const {
    isAuthenticated,
    isAuthenticating,
    authClient,
    login,
    logout,
    identity,
    systemActor,
  } = useAuthClient()

  const [loading, setLoading] = useState(false)
  const [walletCanisterId, setWalletCanisterId] = useState<string>("")
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
        minH="100px"
        boxShadow="md"
        borderRadius="md"
        position="relative"
        justify="space-between"
      >
        {isAuthenticating && <Loading title="Authenticating" />}
        {loading && <Loading title="Loading Wallet" />}
        {isAuthenticated ? (
          walletCanisterId ? (
            <CanisterLink
              address={walletCanisterId}
              version={version}
              user={identity}
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
            <Text fontSize="sm">
              Login with your Internet Identity to continue.
            </Text>
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
