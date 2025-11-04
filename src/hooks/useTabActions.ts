/**
 * useTabActions Hook
 * 封裝標籤操作的業務邏輯,包括:
 * - 清除 TanStack Query 快取
 * - 處理路由跳轉
 * - 調用 TabsContext 的狀態更新
 */

import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTabContext } from "./useTabContext";
import { getQueryPrefixByPath } from "@/router";

export function useTabActions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    tabs,
    closeTab: closeTabState,
    closeAll: closeAllState,
    closeOthers: closeOthersState,
  } = useTabContext();

  /**
   * 清除指定標籤的 Query 快取
   */
  const clearTabCache = (tabId: string) => {
    const queryPrefix = getQueryPrefixByPath(tabId);
    if (queryPrefix) {
      queryClient.removeQueries({
        type: "all", // 移除所有狀態的查詢,包括 active 和 inactive
        predicate: (query) => {
          const firstKey = query.queryKey[0];
          if (typeof firstKey !== "string") return false;

          // 支援單一前綴或多個前綴
          const prefixes = Array.isArray(queryPrefix)
            ? queryPrefix
            : [queryPrefix];

          // 檢查 queryKey 的第一個元素是否以任一前綴開頭
          return prefixes.some((prefix) => firstKey.startsWith(prefix));
        },
      });
    }
  };

  /**
   * 關閉指定標籤
   * - 更新標籤狀態 (先移除,讓組件卸載)
   * - 清除該標籤的快取 (在組件卸載後清除)
   * - 如果關閉後沒有標籤,導航到首頁
   */
  const closeTab = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);

    // 檢查標籤是否可關閉
    if (tab?.closable === false) {
      return;
    }

    // 先更新狀態,讓組件開始卸載
    closeTabState(tabId);

    // 如果關閉後沒有標籤了,導航到首頁
    if (tabs.length === 1) {
      navigate("/");
    }

    // 延遲清除快取,確保組件完全卸載後再清除
    // 使用 setTimeout 確保在下一個事件循環中執行,此時 React 已經完成卸載
    setTimeout(() => {
      clearTabCache(tabId);
    }, 0);

    // TabsContext 會自動更新 activeTabId,useEffect 會監聽並同步路由
  };

  /**
   * 關閉所有標籤
   * - 更新標籤狀態 (先移除,讓組件卸載)
   * - 清除所有快取 (在組件卸載後清除)
   * - 導航到首頁
   */
  const closeAll = () => {
    // 先更新狀態,讓組件開始卸載
    closeAllState();

    // 導航到首頁
    navigate("/");

    // 延遲清除所有快取,確保組件完全卸載後再清除
    setTimeout(() => {
      queryClient.clear();
    }, 0);
  };

  /**
   * 關閉其他標籤
   * - 更新標籤狀態
   * - 清除其他標籤的快取 (延遲執行)
   * - 導航到保留的標籤
   */
  const closeOthers = (keepId: string) => {
    // 先更新狀態,讓組件開始卸載
    closeOthersState(keepId);

    // 導航到保留的標籤
    const keepTab = tabs.find((t) => t.id === keepId);
    if (keepTab) {
      navigate(keepTab.path);
    }

    // 延遲清除其他標籤的快取
    setTimeout(() => {
      tabs.forEach((tab) => {
        if (tab.id !== keepId) {
          clearTabCache(tab.id);
        }
      });
    }, 0);
  };

  return {
    closeTab,
    closeAll,
    closeOthers,
  };
}
