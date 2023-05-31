import { ChakraProvider } from "@chakra-ui/react"

// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const components = {
  Button: {
    defaultProps: {
      size: "sm",
    },
  },
  Select: {
    defaultProps: {
      size: "sm",
    },
  },
  Input: {
    defaultProps: {
      size: "sm",
    },
  },
  Avatar: {
    defaultProps: {
      size: "sm",
    },
  },
}

const styles = {
  global: {
    html: {
      backgroundColor: "#dadada",
    },
    body: {
      backgroundColor: "#dadada",
    },
  },
}

const theme = extendTheme({ styles, colors, components })

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}

export default ThemeProvider
