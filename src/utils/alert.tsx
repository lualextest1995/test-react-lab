import type { ReactNode } from "react";
import type { ExternalToast } from "sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Toast 基礎配置 - 所有 toast 類型共用
 */
type ToastConfig = ExternalToast & {
  duration?: number;
  position?: "top-center" | "top-right" | "bottom-center" | "bottom-right";
};

/**
 * 確認對話框配置 - 與 toast 選項分離
 */
type ConfirmConfig = {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION = "top-center" as const;

const baseConfig: ToastConfig = {
  duration: DEFAULT_DURATION,
  position: DEFAULT_POSITION,
  richColors: true,
};

/**
 * 顯示成功訊息
 */
function success(message: string, config?: ToastConfig) {
  return toast.success(message, { ...baseConfig, ...config });
}

/**
 * 顯示錯誤訊息
 */
function error(message: string, config?: ToastConfig) {
  return toast.error(message, { ...baseConfig, ...config });
}

/**
 * 顯示資訊訊息
 */
function info(message: string, config?: ToastConfig) {
  return toast.info(message, { ...baseConfig, ...config });
}

/**
 * 顯示帶有操作按鈕的 toast
 * 不使用複雜選項 - 如果需要操作，直接提供
 */
function withAction(
  message: string,
  actionLabel: string,
  actionFn: () => void,
  config?: ToastConfig
) {
  return toast(message, {
    ...baseConfig,
    ...config,
    action: { label: actionLabel, onClick: actionFn },
  });
}

/**
 * 顯示 Promise 狀態 - 載入中/成功/錯誤
 * 對原生 toast.promise 的增強封裝
 */
function promise<T>(
  promiseFn: Promise<T> | (() => Promise<T>),
  messages: {
    loading?: ReactNode;
    success?: ((data: T) => ReactNode) | ReactNode;
    error?: ((err: unknown) => ReactNode) | ReactNode;
  },
  config?: ToastConfig
) {
  return toast.promise(promiseFn, {
    ...messages,
    ...baseConfig,
    ...config,
  });
}

/**
 * 確認對話框 - 完全獨立於 toast 選項
 *
 * 規則：
 * - 提供 onCancel？顯示取消按鈕。
 * - 沒有 onCancel？只有一個按鈕。
 */
function confirm(config: ConfirmConfig, toastConfig?: ToastConfig) {
  const {
    message,
    onConfirm,
    onCancel,
    confirmText = "確認",
    cancelText = "取消",
  } = config;

  // 簡單規則：有取消回調 = 有取消按鈕
  const showCancel = !!onCancel;

  const toastId = toast(
    <div className="flex min-w-[20rem] max-w-lg flex-col gap-3">
      <div className="text-sm text-foreground/80">{message}</div>
      <div className="flex justify-end gap-2">
        {showCancel && (
          <Button
            onClick={() => {
              onCancel();
              toast.dismiss(toastId);
            }}
            variant="outline"
            size="sm"
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={() => {
            onConfirm?.();
            toast.dismiss(toastId);
          }}
          size="sm"
        >
          {confirmText}
        </Button>
      </div>
    </div>,
    {
      ...baseConfig,
      ...toastConfig,
      duration: Infinity, // 確認對話框不自動關閉
    }
  );

  return toastId;
}

/**
 * 自訂內容 - 當以上方法無法滿足需求時
 */
function custom(content: ReactNode, config?: ToastConfig) {
  return toast(content, { ...baseConfig, ...config });
}

const Alert = {
  success,
  error,
  info,
  withAction,
  promise,
  confirm,
  custom,
};

export default Alert;
