import { forwardRef } from "react";
import AppDialog from "@/components/Dialog";
import { Button } from "@/components/ui/button";
import {
  useDialogControl,
  type DialogControlRef,
} from "@/hooks/useDialogControl";

// 定義 Dialog 需要的 payload 類型
export interface ConfirmDialogPayload {
  title: string;
  message: string;
}

// 使用 forwardRef 將 ref 轉發給 useDialogControl
export const ConfirmDialog = forwardRef<DialogControlRef<ConfirmDialogPayload>>(
  (_, ref) => {
    // 使用 useDialogControl hook 管理 Dialog 狀態
    const { open, setOpen, payload } = useDialogControl<
      object,
      ConfirmDialogPayload
    >(ref);

    const handleConfirm = () => {
      console.log("確認操作:", payload);
      setOpen(false);
    };

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
        </div>
      </AppDialog>
    );
  }
);

ConfirmDialog.displayName = "ConfirmDialog";
