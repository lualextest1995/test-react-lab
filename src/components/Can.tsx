import { type ReactNode } from "react";
import { useHasGrant } from "@/hooks/usePageGrants";

type CanProps = {
  grant: string;
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * 聲明式權限控制組件
 * 根據當前頁面權限決定是否渲染子組件
 *
 * @param grant - 需要的權限名稱
 * @param children - 有權限時渲染的內容
 * @param fallback - 無權限時渲染的內容 (預設為 null)
 *
 * @example
 * // 簡單使用
 * <Can grant="create">
 *   <Button>新增用戶</Button>
 * </Can>
 *
 * @example
 * // 使用 fallback
 * <Can grant="export" fallback={<Button disabled>匯出 (無權限)</Button>}>
 *   <Button>匯出</Button>
 * </Can>
 */
export function Can({ grant, children, fallback = null }: CanProps) {
  const hasPermission = useHasGrant(grant);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
