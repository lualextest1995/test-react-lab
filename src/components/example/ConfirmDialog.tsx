import { forwardRef, useEffect, useState } from "react";
import AppDialog from "@/components/Dialog";
import { Button } from "@/components/ui/button";
import {
  useDialogControl,
  type DialogControlRef,
} from "@/hooks/useDialogControl";
import axios from "axios";

// 定義 Dialog 需要的 payload 類型
export interface ConfirmDialogPayload {
  title: string;
  message: string;
}

// 定義使用者類型
interface User {
  id: number;
  name: string;
  email: string;
}

// 使用 forwardRef 將 ref 轉發給 useDialogControl
export const ConfirmDialog = forwardRef<DialogControlRef<ConfirmDialogPayload>>(
  (_, ref) => {
    // 使用 useDialogControl hook 管理 Dialog 狀態
    const { open, setOpen, payload } = useDialogControl<
      object,
      ConfirmDialogPayload
    >(ref);

    const [usersData, setUsersData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
      console.log("確認操作:", payload);
      setOpen(false);
    };

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<User[]>(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsersData(response.data);
      } catch (error) {
        console.error("載入使用者失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 當對話框打開時加載數據
    useEffect(() => {
      if (open) {
        fetchUsers();
      } else {
        // 關閉時清除數據
        setUsersData([]);
      }
    }, [open]);

    return (
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="確認操作"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirm}>確認</Button>
          </>
        }
      >
        <div className="px-6 py-4">
          <h3 className="font-semibold mb-2">{payload?.title}</h3>
          <p className="text-sm text-gray-600">{payload?.message}</p>
          <div className="mt-4">
            <h4 className="font-medium mb-2">使用者列表:</h4>
            {isLoading ? (
              <p>載入中...</p>
            ) : (
              <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                {usersData?.map((user) => (
                  <li key={user.id} className="text-sm text-gray-700">
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              onClick={() => fetchUsers()}
            >
              重新載入使用者
            </Button>
          </div>
        </div>
      </AppDialog>
    );
  }
);

ConfirmDialog.displayName = "ConfirmDialog";
