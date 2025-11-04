import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { getCookie } from "@/utils/cookies";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Welcome() {
  const { user, login, setPermissions } = useAuth();
  const { t } = useTranslation();

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

  useEffect(() => {
    // 如果已經登入就不要重複執行
    if (user) return;

    const token = getCookie("token");
    if (token && token === "TestToken") {
      simulateLogin().then(({ user, permissions }) => {
        login(user);
        setPermissions(permissions);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在首次掛載時執行

  return (
    <div>
      Welcome {user?.name}
      <h1>{t("hello")}</h1>
      <Button>
        <Link to="/dashboard/player">去用戶列表</Link>
      </Button>
      <Button>
        <Link to="/dashboard/contest">去競賽管理</Link>
      </Button>
    </div>
  );
}
