import { createRoot } from "react-dom/client"
import App from "wallet/App"
import ThemeProvider from "wallet/Theme"

const container = document.getElementById("app")
const root = createRoot(container!)
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
