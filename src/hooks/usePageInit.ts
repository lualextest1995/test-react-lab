import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTabContext } from './useTabContext';

interface UsePageInitOptions {
  /** 初始化回調函式 */
  onInit: () => void;
}

/**
 * 頁面初始化 Hook
 * 用於管理頁面的首次初始化邏輯,避免重複執行
 *
 * 會自動檢查當前路由是否在 tabs 中,只有存在時才執行初始化
 * 這可以防止 tab 關閉時觸發不必要的初始化請求
 *
 * @example
 * ```tsx
 * usePageInit({
 *   onInit: () => {
 *     fetchData();
 *   }
 * });
 * ```
 */
export function usePageInit({ onInit }: UsePageInitOptions) {
  const { tabs } = useTabContext();
  const location = useLocation();
  const isInit = useRef(false);

  useEffect(() => {
    if (isInit.current) return;

    // 檢查當前路由是否在 tabs 中
    const currentPath = location.pathname;
    const hasTab = tabs.find((tab) => tab.id === currentPath);
    if (!hasTab) return;

    onInit();
    isInit.current = true;
  }, [tabs, location.pathname, onInit]);

  return { isInit: isInit.current };
}
