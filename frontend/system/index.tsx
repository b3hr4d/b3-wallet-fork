import { createRoot } from "react-dom/client"
import App from "system/App"
import ThemeProvider from "system/Theme"

const container = document.getElementById("app")
const root = createRoot(container!)
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
