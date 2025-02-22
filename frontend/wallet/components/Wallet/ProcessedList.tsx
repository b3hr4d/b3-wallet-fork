import { Accordion, Stack, Text } from "@chakra-ui/react"
import { ProcessedRequest } from "declarations/b3_wallet/b3_wallet.did"
import { useEffect, useState } from "react"
import Processed from "wallet/components/Wallet/Processed"
import { B3Wallet } from "wallet/service/actor"

interface ProcessedProps {
  fetchAccounts: () => void
  setLoading: (loading: boolean) => void
  actor: B3Wallet
}

const ProcessedList: React.FC<ProcessedProps> = ({ setLoading, actor }) => {
  const [processedList, setProcessedList] = useState<ProcessedRequest[]>([])

  useEffect(() => {
    console.log("fetching processed")
    setLoading(true)

    actor
      .get_processed_list()
      .then((processed) => {
        console.log(processed)
        setProcessedList(processed.reverse())
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack spacing={4}>
      <Text fontSize="xl" fontWeight="bold">
        Processed
      </Text>
      <Accordion allowToggle>
        {processedList.map((request, i) => (
          <Processed key={i} {...request} />
        ))}
      </Accordion>
    </Stack>
  )
}

export default ProcessedList
