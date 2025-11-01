import type { Permissions } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Welcome from "@/pages/Welcome";
import Loading from "@/components/Loading";
import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { Suspense, lazy, type ComponentType } from "react";
import loggingMiddleware from "@/middlewares/logging";
import authenticationMiddleware from "@/middlewares/authentication";

type RouteConfig = {
  component: ComponentType;
  path: string;
  loader?: RouteObject["loader"];
};

const ROUTES_NAMES = {
  DASHBOARD_PLAYER_LIST: "/dashboard/player",
  DASHBOARD_PLAYER_VERIFY_APPLY: "/dashboard/player/verifyApply",
  DASHBOARD_CONTEST_LIST: "/dashboard/contest",
  DASHBOARD_CONTEST_DISPUTED_LIST: "/dashboard/contest/:contest_id/disputed",
  DASHBOARD_PASSBOOK_TRANSACTION_RECORDS: "/dashboard/passbook",
} as const;

const routeConfigMap: Record<string, RouteConfig> = {
  [ROUTES_NAMES.DASHBOARD_PLAYER_LIST]: {
    component: lazy(() => import("@/pages/UserManagement/UserList")),
    path: "/dashboard/player",
    loader: async () => {
      // Simulate loading data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {};
    },
  },
  [ROUTES_NAMES.DASHBOARD_PLAYER_VERIFY_APPLY]: {
    component: lazy(
      () => import("@/pages/UserManagement/VerificationRequests")
    ),
    path: "/dashboard/player/verifyApply",
  },
  [ROUTES_NAMES.DASHBOARD_CONTEST_LIST]: {
    component: lazy(() => import("@/pages/ContestManagement/ContestList")),
    path: "/dashboard/contest",
  },
  [ROUTES_NAMES.DASHBOARD_CONTEST_DISPUTED_LIST]: {
    component: lazy(() => import("@/pages/ContestManagement/DisputeList")),
    path: "/dashboard/contest/:contest_id/disputed",
  },
  [ROUTES_NAMES.DASHBOARD_PASSBOOK_TRANSACTION_RECORDS]: {
    component: lazy(
      () => import("@/pages/ReportManagement/TransactionRecords")
    ),
    path: "/dashboard/passbook",
  },
};

/**
 * 從後端權限資料生成 React Router 路由配置
 */
export function buildRoutes(permissions: Permissions): RouteObject[] {
  if (!permissions?.length) {
    return [];
  }

  return permissions.flatMap((module) =>
    module.page
      .filter((page) => routeConfigMap[page.path])
      .map((page) => {
        const routeConfig = routeConfigMap[page.path];
        const Component = routeConfig.component;
        const loader = routeConfig.loader;

        return {
          path: routeConfig.path,
          element: (
            <Suspense
              fallback={<Loading type="component" text="載入組件中..." />}
            >
              <Component />
            </Suspense>
          ),
          loader,
        } satisfies RouteObject;
      })
  );
}

export function createAppRouter(
  permissions: Permissions,
  isAuthenticated: boolean = false
) {
  // 動態生成的路由
  const dynamicRoutes = buildRoutes(permissions);
  //
  if (!isAuthenticated) {
    return createBrowserRouter([
      {
        path: "/",
        element: <MainLayout />,
        middleware: [loggingMiddleware, authenticationMiddleware],
        children: [{ index: true, element: <Welcome /> }],
      },
      {
        path: "/login",
        element: <Login />,
        middleware: [loggingMiddleware, authenticationMiddleware],
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ]);
  }

  // 已登入：完整路由表
  return createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      middleware: [loggingMiddleware, authenticationMiddleware],
      children: [{ index: true, element: <Welcome /> }, ...dynamicRoutes],
    },
    {
      path: "/login",
      element: <Login />,
      middleware: [loggingMiddleware, authenticationMiddleware],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
