"use client";

import type * as React from "react";
import Menu, { type MenuItem } from "./Menu";
import { useMemo } from "react";
import type { Permissions } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import Header from "./Header";
import User from "./User";

/**
 * 扁平化選單資料結構 - Linus 式設計：消除樹形遞迴
 *
 * 原則：
 * 1. 資料結構要簡單 - 扁平列表，不是嵌套樹
 * 2. 查找要快速 - O(1) 路徑比對，不是 O(n) 遞迴
 * 3. 渲染要直接 - 一次 map，不需要遞迴組件
 */
function buildMenu(permissions: Permissions): MenuItem[] {
  if (!permissions) {
    return [];
  }

  const items: MenuItem[] = [];

  // 扁平化：兩層迴圈替代樹形結構
  for (const group of permissions) {
    // 群組標題作為第一層
    items.push({
      id: `group-${group.name}`,
      name: group.name,
      level: 0,
      isGroup: true,
    });

    // 頁面項目作為第二層
    for (const page of group.page) {
      items.push({
        id: page.path,
        name: page.name,
        path: page.path,
        level: 1,
        isGroup: false,
      });
    }
  }

  return items;
}

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { permissions } = useAuth();
  const menu = useMemo(() => buildMenu(permissions), [permissions]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <Menu items={menu} />
      </SidebarContent>
      <SidebarFooter>
        <User />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
