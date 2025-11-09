import { useMemo, Suspense } from "react";
import { RouterProvider } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { createAppRouter } from "@/router";
import Loading from "@/components/Loading";

export default function App() {
  const { permissions, isAuthenticated } = useAuth();

  const router = useMemo(() => {
    return createAppRouter(permissions, isAuthenticated);
  }, [permissions, isAuthenticated]);

  return (
    <Suspense fallback={<Loading type="router" text="載入中..." />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
