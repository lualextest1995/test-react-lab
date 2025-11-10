import { createRoot } from "react-dom/client";
import AuthContextProvider from "@/contexts/AuthContext.tsx";
import TabsContextProvider from "./contexts/TabsContext";
import ThemeProvider from "./contexts/ThemeContext.tsx";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthContextProvider>
      <TabsContextProvider>
        <App />
        <Toaster expand />
      </TabsContextProvider>
    </AuthContextProvider>
  </ThemeProvider>
);
