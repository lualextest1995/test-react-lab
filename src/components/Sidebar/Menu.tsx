"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocation } from "react-router";
import { Link } from "react-router";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { useMemo, useEffect, useState } from "react";

/**
 * 扁平化選單項目 - 消除嵌套結構
 *  level: 項目層級 (0: 群組, 1: 項目)
 *  isGroup: 是否為群組標記
 */
export type MenuItem = {
  id: string;
  name: string;
  path?: string;
  level: number;
  isGroup: boolean;
};

/**
 * 群組資料結構：扁平列表轉換成群組+項目對應
 */
type MenuGroup = {
  id: string;
  name: string;
  items: MenuItem[];
};

/**
 * 將扁平列表轉換成群組結構 - O(n) 一次掃描
 * 不是遞迴，是簡單的順序分組
 */
function groupItems(flatItems: MenuItem[]): MenuGroup[] {
  const groups: MenuGroup[] = [];
  let currentGroup: MenuGroup | null = null;

  for (const item of flatItems) {
    if (item.isGroup) {
      // 遇到群組標記，創建新群組
      currentGroup = { id: item.id, name: item.name, items: [] };
      groups.push(currentGroup);
    } else if (currentGroup) {
      // 將項目加入當前群組
      currentGroup.items.push(item);
    }
  }

  return groups;
}

/**
 * 找出包含指定路徑的群組 ID - O(n) 掃描
 */
function findActiveGroupId(
  groups: MenuGroup[],
  currentPath: string
): string | null {
  for (const group of groups) {
    if (group.items.some((item) => item.path === currentPath)) {
      return group.id;
    }
  }
  return null;
}

export default function Menu({ items }: { items: MenuItem[] }) {
  const location = useLocation();

  // 扁平列表轉群組：O(n) 一次掃描
  const groups = useMemo(() => groupItems(items), [items]);

  // 找出當前 active 的群組 ID
  const activeGroupId = useMemo(
    () => findActiveGroupId(groups, location.pathname),
    [groups, location.pathname]
  );

  // 展開狀態：Map<群組ID, 是否展開>
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    // 初始化：展開包含 active 項目的群組
    return activeGroupId ? new Set([activeGroupId]) : new Set();
  });

  // 路由變化時，自動展開包含新 active 項目的群組
  useEffect(() => {
    if (activeGroupId && !openGroups.has(activeGroupId)) {
      setOpenGroups((prev) => new Set(prev).add(activeGroupId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroupId]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {groups.map((group) => {
          const isOpen = openGroups.has(group.id);

          return (
            <Collapsible
              key={group.id}
              open={isOpen}
              onOpenChange={(open) => {
                setOpenGroups((prev) => {
                  const next = new Set(prev);
                  if (open) {
                    next.add(group.id);
                  } else {
                    next.delete(group.id);
                  }
                  return next;
                });
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Folder className="h-4 w-4" />
                    <span>{group.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {group.items.map((item) => {
                      const isActive = item.path === location.pathname;

                      return (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link to={item.path || "#"}>
                              <FileText className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
