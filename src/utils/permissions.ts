import type { Permissions } from "@/contexts/AuthContext";

/**
 * 從路徑查找對應的權限
 * 支援動態路由匹配 (例: /dashboard/contest/:contest_id/disputed)
 */
export function getGrantsForPath(
  permissions: Permissions,
  path: string
): string[] {
  if (!permissions) {
    return [];
  }

  for (const group of permissions) {
    for (const page of group.page) {
      // 將動態路由參數轉換成正則表達式
      // /dashboard/contest/:contest_id/disputed
      // → /dashboard/contest/[^/]+/disputed
      const pattern = page.path.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(path)) {
        return page.grant;
      }
    }
  }
  return [];
}

/**
 * 檢查特定路徑是否有某個權限
 */
export function hasGrant(
  permissions: Permissions,
  path: string,
  grant: string
): boolean {
  const grants = getGrantsForPath(permissions, path);
  return grants.includes(grant);
}
