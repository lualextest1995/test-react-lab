import { useCallback, useImperativeHandle, useState } from "react";

export interface DialogControlRef<P = void> {
  open: (payload?: P) => void;
  close: () => void;
}

export function useDialogControl<T extends object = object, P = void>(
  ref: React.ForwardedRef<DialogControlRef<P> & T>,
  extraMethods?: T
) {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<P | undefined>(undefined);

  const openDialog = useCallback((data?: P) => {
    setPayload(data);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setPayload(undefined);
  }, []);

  useImperativeHandle(
    ref,
    () =>
      ({
        open: openDialog,
        close: closeDialog,
        ...(extraMethods ?? ({} as T)),
      } as DialogControlRef<P> & T),
    [openDialog, closeDialog, extraMethods] // ✅ 唯一的優化：加上 deps
  );

  return { open, setOpen, payload }; // ✅ 簡化返回值
}
