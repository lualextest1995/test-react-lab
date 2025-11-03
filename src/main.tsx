import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthContextProvider from "@/contexts/AuthContext.tsx";
import TabsContextProvider from "./contexts/TabsContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <TabsContextProvider>
        <App />
      </TabsContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
