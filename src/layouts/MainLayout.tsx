import { Outlet, useNavigation } from "react-router";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";

export default function MainLayout() {
  const navigation = useNavigation();
  // navigation.state 有三種狀態: "idle" | "loading" | "submitting"
  const isLoading = navigation.state === "loading";

  return (
    <div>
      <h1>Main Layout</h1>
      <Sidebar />
      <Outlet />
      {/* 全局 Loading 指示器 */}
      {isLoading && <Loading type="loader" text="載入資料中..." />}
    </div>
  );
}
