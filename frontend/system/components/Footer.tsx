import { Box, VStack } from "@chakra-ui/react"
import React from "react"

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <Box as="footer" role="contentinfo" py="2" px={{ base: "4", md: "8" }}>
      <VStack>
        <Box fontSize="sm">&copy; {new Date().getFullYear()} B3System.</Box>
      </VStack>
    </Box>
  )
}
