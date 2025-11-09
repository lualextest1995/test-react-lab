import { Activity } from "react";
import { useLocation, useNavigation, useOutlet } from "react-router";
import { useEffect, useState, type ReactNode } from "react";
import Loading from "@/components/Loading";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import TabBar from "@/components/TabBar";
import { useTabContext } from "@/hooks/useTabContext";

type CachedOutletMap = Map<string, ReactNode>;

function TabContentArea() {
  const outlet = useOutlet();
  const location = useLocation();
  const { tabs, activeTabId } = useTabContext();
  const [cachedOutlets, setCachedOutlets] = useState<CachedOutletMap>(
    () => new Map()
  );

  // 緩存當前路由對應的 outlet，確保切換時保持狀態
  useEffect(() => {
    if (!outlet) return;
    setCachedOutlets((prev) => {
      const key = location.pathname;
      const existing = prev.get(key);
      if (existing && key !== activeTabId) {
        return prev;
      }
      const next = new Map(prev);
      next.set(key, outlet);
      return next;
    });
  }, [location.pathname, outlet, activeTabId]);

  // 清除已關閉標籤對應的快取
  useEffect(() => {
    if (tabs.length === 0) {
      setCachedOutlets(new Map());
      return;
    }

    const allowedPaths = new Set(tabs.map((tab) => tab.path));
    setCachedOutlets((prev) => {
      let changed = false;
      const next: CachedOutletMap = new Map();
      prev.forEach((value, key) => {
        if (allowedPaths.has(key)) {
          next.set(key, value);
        } else {
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [tabs]);

  const hasTabs = tabs.length > 0;

  if (!hasTabs) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{outlet}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const cached = cachedOutlets.get(tab.path);
        const node = cached ?? (isActive ? outlet : null);
        if (!node) return null;

        return (
          <Activity key={tab.id} mode={isActive ? "visible" : "hidden"}>
            <div className="container mx-auto p-6">{node}</div>
          </Activity>
        );
      })}
    </div>
  );
}

export default function MainLayout() {
  const navigation = useNavigation();
  // navigation.state 有三種狀態: "idle" | "loading" | "submitting"
  const isLoading = navigation.state === "loading";

  return (
    <SidebarProvider>
      <Sidebar />
      <main className="w-full h-screen flex flex-col">
        <SidebarTrigger />
        <div className="flex-1 overflow-auto">
          <TabContentArea />
        </div>
        <TabBar />
        {/* 全局 Loading 指示器 */}
        {isLoading && <Loading type="loader" text="載入資料中..." />}
      </main>
    </SidebarProvider>
  );
}
