import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  maxHeight?: string;
  loading?: boolean;
  dismissible?: boolean;
}

const SIZE_MAP = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  full: "sm:max-w-full",
} as const;

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = "sm",
  maxHeight = "min(600px,80vh)",
  loading = false,
  dismissible = true,
}: DialogProps) {
  const showHeader = title || description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={clsx("flex flex-col gap-0 p-0", SIZE_MAP[size])}
        style={{ maxHeight }}
        onInteractOutside={(e) =>
          dismissible ? undefined : e.preventDefault()
        }
      >
        <div className="relative flex flex-col flex-1 min-h-0">
          {/* Header */}
          {showHeader && (
            <DialogHeader className="shrink-0 border-b px-6 py-4 space-y-2 text-left">
              {title && <DialogTitle className="mb-0">{title}</DialogTitle>}
              <DialogDescription className={description ? "" : "sr-only"}>
                {description}
              </DialogDescription>
            </DialogHeader>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto scrollbar">{children}</div>

          {/* Footer */}
          {footer && (
            <DialogFooter className="shrink-0 border-t px-6 py-4 flex-row items-center justify-end space-x-2">
              {footer}
            </DialogFooter>
          )}

          {/* Loading Overlay */}
          {loading && <LoadingOverlay />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
