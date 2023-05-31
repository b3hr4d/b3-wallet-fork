import App from "App"
import ThemeProvider from "Theme"
import { createRoot } from "react-dom/client"

const container = document.getElementById("app")
const root = createRoot(container!)
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
