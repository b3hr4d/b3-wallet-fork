import { Heading } from "@chakra-ui/react"

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <Heading textAlign="center" p={4} my={2}>
      B3System
    </Heading>
  )
}

export default Header
