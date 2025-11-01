import type { Permissions } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useMemo, useState } from "react";
import { NavLink } from "react-router";
import { clearAllCookies } from "@/utils/cookies";
import { Button } from "./ui/button";

type MenuItem = {
  name: string;
  path?: string;
  children?: MenuItem[];
};

function buildMenu(permissions: Permissions): MenuItem[] {
  if (!permissions) {
    return [];
  }

  return permissions.map((group) => ({
    name: group.name,
    children: group.page.map((page) => ({
      name: page.name,
      path: page.path,
    })),
  }));
}

export default function Sidebar() {
  const { permissions } = useAuth();
  const menu = useMemo(() => buildMenu(permissions), [permissions]);
  const { logout } = useAuth();
  const handleLogout = () => {
    clearAllCookies();
    logout();
  };
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  return (
    <aside style={{ width: 250, padding: 20, backgroundColor: "#f5f5f5" }}>
      <h3>選單</h3>
      {menu.map((group) => (
        <div key={group.name} style={{ marginBottom: 16 }}>
          <button onClick={() => toggleGroup(group.name)}>
            {expandedGroups.has(group.name) ? "▼" : "▶"} {group.name}
          </button>
          {expandedGroups.has(group.name) && group.children && (
            <ul style={{ listStyle: "none", paddingLeft: 20 }}>
              {group.children.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path || "#"}>{item.name}</NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <Button onClick={handleLogout}>登出</Button>
    </aside>
  );
}
