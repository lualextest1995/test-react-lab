import { useMemo } from "react";
import { RouterProvider } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { createAppRouter } from "@/router";

export default function App() {
  const { permissions, isAuthenticated } = useAuth();

  const router = useMemo(() => {
    return createAppRouter(permissions, isAuthenticated);
  }, [permissions, isAuthenticated]);

  return <RouterProvider router={router} />;
}
