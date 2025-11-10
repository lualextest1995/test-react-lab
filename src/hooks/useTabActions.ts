/**
 * useTabActions Hook
 * 封裝標籤操作的業務邏輯,包括:
 * - 處理路由跳轉
 * - 調用 TabsContext 的狀態更新
 */

import { useNavigate } from "react-router";
import { useTabContext } from "./useTabContext";

export function useTabActions() {
  const navigate = useNavigate();
  const {
    tabs,
    closeTab: closeTabState,
    closeAll: closeAllState,
    closeOthers: closeOthersState,
  } = useTabContext();

  /**
   * 關閉指定標籤
   * - 更新標籤狀態 (先移除,讓組件卸載)
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

    // TabsContext 會自動更新 activeTabId,useEffect 會監聽並同步路由
  };

  /**
   * 關閉所有標籤
   * - 更新標籤狀態 (先移除,讓組件卸載)
   * - 導航到首頁
   */
  const closeAll = () => {
    // 先更新狀態,讓組件開始卸載
    closeAllState();

    // 導航到首頁
    navigate("/");
  };

  /**
   * 關閉其他標籤
   * - 更新標籤狀態
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
  };

  return {
    closeTab,
    closeAll,
    closeOthers,
  };
}
