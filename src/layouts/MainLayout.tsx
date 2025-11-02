import { Outlet, useNavigation } from "react-router";
import Loading from "@/components/Loading";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";

export default function MainLayout() {
  const navigation = useNavigation();
  // navigation.state 有三種狀態: "idle" | "loading" | "submitting"
  const isLoading = navigation.state === "loading";

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <SidebarTrigger />

        <Outlet />
        {/* 全局 Loading 指示器 */}
        {isLoading && <Loading type="loader" text="載入資料中..." />}
      </main>
    </SidebarProvider>
  );
}
