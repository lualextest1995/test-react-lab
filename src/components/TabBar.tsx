/**
 * TabBar 組件
 * 顯示當前打開的標籤頁，支持切換、關閉等操作
 * 自動與路由同步
 */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTabContext } from "@/hooks/useTabContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { X, FileText } from "lucide-react";
import type { Permissions } from "@/contexts/AuthContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

/**
 * 從權限結構中查找路由節點信息
 */
function findRouteNode(path: string, permissions: Permissions) {
  if (!permissions) return null;

  for (const group of permissions) {
    const page = group.page.find((p) => p.path === path);
    if (page) {
      return page;
    }
  }
  return null;
}

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    switchTab,
    closeOthers,
    closeAll,
  } = useTabContext();
  const { permissions } = useAuth();

  // 監聽 activeTabId 變化，同步路由
  useEffect(() => {
    if (activeTabId && activeTabId !== location.pathname) {
      const tab = tabs.find((t) => t.id === activeTabId);
      if (tab) {
        navigate(tab.path, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  // 監聽路由變化，自動打開標籤
  useEffect(() => {
    const currentPath = location.pathname;

    // 首頁不需要顯示在 TabBar 上，直接返回
    if (currentPath === "/") {
      return;
    }

    // 檢查標籤是否已經存在，避免重複打開
    const existingTab = tabs.find((t) => t.id === currentPath);
    if (existingTab) {
      // 如果標籤已存在，只切換不重新打開
      if (activeTabId !== currentPath) {
        switchTab(currentPath);
      }
      return;
    }

    // 查找當前路由的信息
    const routeNode = findRouteNode(currentPath, permissions);

    if (routeNode) {
      openTab({
        id: currentPath,
        title: routeNode.name,
        path: currentPath,
        closable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, permissions]);

  // 點擊標籤，切換標籤
  const handleTabClick = (tabId: string) => {
    // 切換標籤狀態，useEffect 會監聽 activeTabId 變化並同步路由
    switchTab(tabId);
  };

  // 關閉標籤
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // 防止觸發標籤點擊事件

    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.closable === false) {
      return; // 不可關閉的標籤不處理
    }

    closeTab(tabId);

    // 如果關閉後沒有標籤了，導航到首頁
    if (tabs.length === 1) {
      navigate("/");
    }
    // TabsContext 會自動更新 activeTabId，useEffect 會監聽並同步路由
  };

  // 關閉其他標籤
  const handleCloseOthers = (tabId: string) => {
    closeOthers(tabId);

    // 導航到保留的標籤
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  // 關閉所有標籤
  const handleCloseAll = () => {
    closeAll();
    // 關閉所有標籤後導航到首頁
    navigate("/");
  };

  // 如果沒有標籤，不顯示 TabBar
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-1 h-10 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const closable = tab.closable !== false; // 默認可關閉

        return (
          <ContextMenu key={tab.id}>
            <ContextMenuTrigger asChild>
              <button
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-t-md text-sm transition-colors border-b-2 whitespace-nowrap",
                  isActive
                    ? "bg-slate-50 text-slate-900 border-blue-500 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                )}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[120px]">{tab.title}</span>
                {closable && (
                  <X
                    className="w-3.5 h-3.5 flex-shrink-0 hover:bg-slate-200 rounded transition-colors"
                    onClick={(e) => handleCloseTab(e, tab.id)}
                  />
                )}
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              {closable && (
                <>
                  <ContextMenuItem
                    onClick={() => {
                      closeTab(tab.id);

                      // 如果關閉後沒有標籤了，導航到首頁
                      if (tabs.length === 1) {
                        navigate("/");
                      }
                      // TabsContext 會自動更新 activeTabId，useEffect 會監聽並同步路由
                    }}
                  >
                    關閉
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </>
              )}
              <ContextMenuItem onClick={() => handleCloseOthers(tab.id)}>
                關閉其他標籤
              </ContextMenuItem>
              <ContextMenuItem onClick={handleCloseAll} variant="destructive">
                關閉所有標籤
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}
