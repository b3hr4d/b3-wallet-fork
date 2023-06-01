/* eslint-disable no-unused-vars */
import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons"
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react"
import React, { useCallback } from "react"
import Address from "../../../system/components/CanisterLink"
import Balance from "./Balance"
import TransferForm from "./TransferForm"

interface ChainProps {
  balance: bigint
  chain: string
  address: string
  network: string
  handleAddressRemove: (network: string, chain: string) => void
  handleTransfer: (from: string, to: string, amount: bigint) => Promise<void>
  handleBalance: () => Promise<void>
  handleTopup?: (from: string, to: string, amount: bigint) => Promise<void>
  loading: boolean
}

export const Chain: React.FC<ChainProps> = ({
  balance,
  chain,
  address,
  network,
  handleAddressRemove,
  handleTransfer,
  handleBalance,
  handleTopup,
  loading,
}) => {
  const removeHandler = useCallback(async () => {
    handleAddressRemove(chain, network)
  }, [handleAddressRemove, network, chain])

  return (
    <Card size="md">
      <CardHeader pb={0}>
        <Stack direction="row" justify="space-between" align="center">
          <Flex flex={5}>
            <Heading size="xs">{chain}</Heading>
          </Flex>
          <Flex flex={5}>
            <Text>{network}</Text>
          </Flex>
          <Stack
            direction="row"
            justify="space-between"
            align="center"
            flex={2}
          >
            <IconButton
              aria-label="Refresh"
              icon={<RepeatIcon />}
              color="green"
              onClick={handleBalance}
            />
            <IconButton
              aria-label="Remove"
              onClick={removeHandler}
              icon={<DeleteIcon />}
              color="red"
            />
          </Stack>
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack>
          <Stack direction="row" justify="space-between" align="center">
            <Address address={address} flex={9} />
            <Balance
              amount={balance}
              chain={chain}
              loading={loading}
              flex={3}
            />
          </Stack>
          <TransferForm
            address={address}
            loading={loading}
            title={`Send ${chain}`}
            handleTransfer={handleTransfer}
          />
          {handleTopup && (
            <TransferForm
              address={address}
              loading={loading}
              title="Topup"
              handleTransfer={handleTopup}
            />
          )}
        </Stack>
      </CardBody>
    </Card>
  )
}

export default Chain
