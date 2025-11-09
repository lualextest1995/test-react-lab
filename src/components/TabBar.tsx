/**
 * TabBar 組件
 * 顯示當前打開的標籤頁，支持切換、關閉等操作
 * 自動與路由同步
 */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTabContext } from "@/hooks/useTabContext";
import { useTabActions } from "@/hooks/useTabActions";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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
  const { tabs, activeTabId, openTab, switchTab } = useTabContext();
  const { closeTab, closeOthers, closeAll } = useTabActions();
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

    closeTab(tabId);
  };

  // 如果沒有標籤，不顯示 TabBar
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="h-12 md:h-10 bg-muted/50 border-b flex items-center px-2 gap-1 overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const closable = tab.closable !== false; // 默認可關閉

        return (
          <ContextMenu key={tab.id}>
            <ContextMenuTrigger asChild>
              <button
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-4 h-9 md:h-7 md:px-3 md:gap-1.5 text-sm md:text-[13px] rounded-md transition-all whitespace-nowrap select-none touch-manipulation",
                  "active:scale-95",
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                )}
              >
                <span className="truncate max-w-[140px]">
                  {tab.title}
                </span>

                {closable && (
                  <X
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    className={cn(
                      "w-4 h-4 md:w-3.5 md:h-3.5 shrink-0 rounded-sm transition-opacity",
                      "touch-manipulation",
                      isActive
                        ? "opacity-70 hover:opacity-100"
                        : "opacity-0 md:opacity-0 group-hover:opacity-60 hover:opacity-100",
                      // 手機上活動標籤始終顯示關閉按鈕
                      isActive && "sm:opacity-70"
                    )}
                  />
                )}
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              {closable && (
                <>
                  <ContextMenuItem onClick={() => closeTab(tab.id)}>
                    關閉
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </>
              )}
              <ContextMenuItem onClick={() => closeOthers(tab.id)}>
                關閉其他
              </ContextMenuItem>
              <ContextMenuItem onClick={closeAll}>
                關閉所有
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}
