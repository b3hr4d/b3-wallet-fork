import {
  Box,
  CircularProgress,
  Progress,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react"
import React from "react"
import LoadingDots from "./LoadingDots"

interface LoadingProps extends StackProps {
  dark?: boolean
  circle?: boolean
  title?: string
}

const Loading: React.FC<LoadingProps> = ({ dark, circle, title, ...rest }) => {
  return (
    <Stack
      position="absolute"
      top="0"
      bottom="0"
      left="0"
      right="0"
      align="center"
      justify="center"
      zIndex={1000}
      backdropFilter="blur(2px)"
      {...rest}
    >
      <Text fontWeight="bold" color={dark ? "white" : "gray.600"}>
        <LoadingDots title={title} />
      </Text>
      <Box w="20vw">
        {circle ? (
          <CircularProgress isIndeterminate color="green.300" />
        ) : (
          <Progress size="xs" isIndeterminate />
        )}
      </Box>
    </Stack>
  )
}

export default Loading
