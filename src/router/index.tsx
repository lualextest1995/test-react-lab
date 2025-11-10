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
  /**
   * TanStack Query 快取前綴
   * 當頁面關閉時，會清理所有以此前綴開頭的查詢快取
   * - 字串：清理 queryKey 第一個元素「以此字串開頭」的查詢
   * - 字串陣列：清理 queryKey 符合「任一前綴開頭」的查詢
   */
  queryPrefix?: string | string[];
};

const ROUTES_NAMES = {
  DASHBOARD_PLAYER_LIST: "/dashboard/player",
  DASHBOARD_PLAYER_VERIFY_APPLY: "/dashboard/player/verifyApply",
  DASHBOARD_CONTEST_LIST: "/dashboard/contest",
  DASHBOARD_CONTEST_DISPUTED_LIST: "/dashboard/contest/:contest_id/disputed",
  DASHBOARD_PASSBOOK_TRANSACTION_RECORDS: "/dashboard/passbook",
} as const;

export const routeConfigMap: Record<string, RouteConfig> = {
  [ROUTES_NAMES.DASHBOARD_PLAYER_LIST]: {
    component: lazy(() => import("@/pages/UserManagement/UserList")),
    path: "/dashboard/player",
    queryPrefix: "player-",
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
    queryPrefix: "player-verify-",
  },
  [ROUTES_NAMES.DASHBOARD_CONTEST_LIST]: {
    component: lazy(() => import("@/pages/ContestManagement/ContestList")),
    path: "/dashboard/contest",
    queryPrefix: "contest-",
  },
  [ROUTES_NAMES.DASHBOARD_CONTEST_DISPUTED_LIST]: {
    component: lazy(() => import("@/pages/ContestManagement/DisputeList")),
    path: "/dashboard/contest/disputed",
    queryPrefix: "dispute-",
  },
  [ROUTES_NAMES.DASHBOARD_PASSBOOK_TRANSACTION_RECORDS]: {
    component: lazy(
      () => import("@/pages/ReportManagement/TransactionRecords")
    ),
    path: "/dashboard/passbook",
    queryPrefix: "passbook-",
  },
};

/**
 * 根據路由路徑取得對應的查詢前綴
 * 用於在頁面關閉時清理相關的 TanStack Query 快取
 */
export function getQueryPrefixByPath(
  path: string
): string | string[] | undefined {
  const routeConfig = Object.values(routeConfigMap).find(
    (config) => config.path === path
  );
  return routeConfig?.queryPrefix;
}

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
