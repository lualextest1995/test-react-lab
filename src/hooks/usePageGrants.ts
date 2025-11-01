import { useMemo } from "react";
import { useLocation } from "react-router";
import { useAuth } from "./useAuth";
import { getGrantsForPath } from "@/utils/permissions";

/**
 * 取得當前頁面的所有權限
 *
 * @returns 當前頁面的權限陣列
 *
 * @example
 * const grants = usePageGrants();
 * console.log(grants); // ["list", "create", "delete"]
 */
export function usePageGrants(): string[] {
  const auth = useAuth();
  const location = useLocation();

  return useMemo(() => {
    if (!auth.isReady || !auth.permissions) {
      return [];
    }
    return getGrantsForPath(auth.permissions, location.pathname);
  }, [auth.isReady, auth.permissions, location.pathname]);
}

/**
 * 檢查當前頁面是否有特定權限
 * 支援單個或多個權限檢查
 *
 * @param grant - 權限名稱 (字串) 或權限陣列
 * @returns
 * - 傳入字串: 回傳 boolean
 * - 傳入陣列: 回傳 { [權限名]: boolean } 物件
 *
 * @example
 * // 單個權限檢查
 * const canCreate = useHasGrant("create");
 * if (canCreate) {
 *   return <Button>新增</Button>;
 * }
 *
 * @example
 * // 多個權限檢查
 * const { create, delete: canDelete, export: canExport } = useHasGrant([
 *   "create",
 *   "delete",
 *   "export"
 * ]);
 *
 * {create && <Button>新增</Button>}
 * {canDelete && <Button>刪除</Button>}
 * {canExport && <Button>匯出</Button>}
 */
export function useHasGrant(grant: string): boolean;
export function useHasGrant(grant: string[]): Record<string, boolean>;
export function useHasGrant(
  grant: string | string[]
): boolean | Record<string, boolean> {
  const grants = usePageGrants();

  return useMemo(() => {
    if (typeof grant === "string") {
      return grants.includes(grant);
    }

    return grant.reduce((acc, g) => {
      acc[g] = grants.includes(g);
      return acc;
    }, {} as Record<string, boolean>);
  }, [grants, grant]);
}
