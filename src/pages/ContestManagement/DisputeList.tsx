import { useRef, useState } from "react";
import { type DialogControlRef } from "@/hooks/useDialogControl";
import {
  ConfirmDialog,
  type ConfirmDialogPayload,
} from "@/components/example/ConfirmDialog";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/Dialog";

export default function DisputeList() {
  const confirmDialogRef = useRef<DialogControlRef<ConfirmDialogPayload>>(null);
  const [simpleDialogOpen, setSimpleDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ name: "", email: "" });
  return (
    <div>
      <h1>DisputeList</h1>
      <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-3 text-purple-600">
          範例 1: 直接使用 AppDialog (狀態控制)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          直接在父組件中管理 Dialog 的開關狀態和內容
        </p>
        <Button onClick={() => setSimpleDialogOpen(true)} variant="default">
          打開簡單對話框
        </Button>

        <AppDialog
          open={simpleDialogOpen}
          onOpenChange={setSimpleDialogOpen}
          title="用戶資料表單"
          description="請填寫您的基本資料"
          size="md"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setSimpleDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  console.log("提交資料:", dialogData);
                  setSimpleDialogOpen(false);
                }}
              >
                提交
              </Button>
            </>
          }
        >
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">姓名</label>
              <input
                type="text"
                value={dialogData.name}
                onChange={(e) =>
                  setDialogData({ ...dialogData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="請輸入姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={dialogData.email}
                onChange={(e) =>
                  setDialogData({ ...dialogData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="請輸入 Email"
              />
            </div>
          </div>
        </AppDialog>
      </div>
      <Button
        onClick={() =>
          confirmDialogRef.current?.open({
            title: "刪除確認",
            message: "您確定要刪除這筆資料嗎？此操作無法復原。",
          })
        }
        variant="destructive"
      >
        刪除資料
      </Button>
      <Button
        onClick={() =>
          confirmDialogRef.current?.open({
            title: "發布文章",
            message: "確定要發布這篇文章嗎？發布後所有用戶都能看到。",
          })
        }
        variant="default"
      >
        發布文章
      </Button>
      <ConfirmDialog ref={confirmDialogRef} />
    </div>
  );
}
