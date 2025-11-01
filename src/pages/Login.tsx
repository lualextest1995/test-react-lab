import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { setCookie } from "@/utils/cookies";
import { useEffect } from "react";
import { getCookie, clearAllCookies } from "@/utils/cookies";

export default function Login() {
  const navigate = useNavigate();
  const { login, logout, setPermissions } = useAuth();

  const fakeUser = {
    id: "user",
    name: "測試用戶",
  };

  const fakePermissions = [
    {
      name: "用戶管理",
      page: [
        { grant: ["list"], name: "用戶列表", path: "/dashboard/player" },
        {
          grant: ["list"],
          name: "認證申請",
          path: "/dashboard/player/verifyApply",
        },
      ],
    },
    {
      name: "競賽管理",
      page: [
        { grant: ["list"], name: "競賽清單", path: "/dashboard/contest" },
        {
          grant: ["list"],
          name: "申訴清單",
          path: "/dashboard/contest/:contest_id/disputed",
        },
      ],
    },
    {
      name: "報表管理",
      page: [
        { grant: ["list"], name: "帳變紀錄", path: "/dashboard/passbook" },
      ],
    },
  ];

  function simulateLogin(): Promise<{
    user: typeof fakeUser;
    permissions: typeof fakePermissions;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: fakeUser, permissions: fakePermissions });
      }, 1000);
    });
  }

  const handleLogin = async () => {
    try {
      const { user, permissions } = await simulateLogin();
      setCookie("token", "TestToken");
      login(user);
      setPermissions(permissions);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // 檢查 token，沒有就清掉所有狀態
    const token = getCookie("token");
    if (!token || token !== "TestToken") {
      clearAllCookies();
      logout(); // 清掉 AuthContext
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在首次掛載時執行

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
