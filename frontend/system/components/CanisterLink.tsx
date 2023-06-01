import { CheckIcon, CopyIcon } from "@chakra-ui/icons"
import {
  Flex,
  FlexProps,
  IconButton,
  Link,
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react"
import { Identity } from "@dfinity/agent"
import { getCanisterLink } from "system/helpers/utiles"

interface CanisterLinkWithCopyProps extends FlexProps {
  address: string
  user?: Identity
  version?: string
}

const CanisterLink: React.FC<CanisterLinkWithCopyProps> = ({
  user,
  address,
  version,
  ...rest
}) => {
  const { hasCopied, onCopy } = useClipboard(address)

  return (
    <Stack spacing={2}>
      <Text>
        User ID: <b>{user?.getPrincipal().toString()}</b>
      </Text>
      <Flex alignItems="center" {...rest}>
        <Text>Canister ID: &nbsp;</Text>
        <b>{address}</b>
        <IconButton
          colorScheme="blue"
          onClick={onCopy}
          aria-label="Copy to clipboard"
          variant="ghost"
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
        />
      </Flex>
      {version && (
        <Text ml={2}>
          Version: <b>{version}</b>
        </Text>
      )}
      <Link href={getCanisterLink(address)} isExternal>
        {getCanisterLink(address)}
      </Link>
    </Stack>
  )
}

export default CanisterLink
