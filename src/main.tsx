import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthContextProvider from "@/contexts/AuthContext.tsx";
import TabsContextProvider from "./contexts/TabsContext";
import ThemeProvider from "./contexts/ThemeContext.tsx";
import "./index.css";
import App from "./App.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 0,
      enabled: true,
      gcTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthContextProvider>
        <TabsContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </TabsContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
