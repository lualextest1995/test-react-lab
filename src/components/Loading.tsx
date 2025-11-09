import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingProps = {
  type: "component" | "loader" | "router" | "skeleton";
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  skeletonVariant?: "default" | "card" | "list" | "table";
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function Loading({
  type,
  text,
  className,
  size = "md",
  skeletonVariant = "default",
}: LoadingProps) {
  if (type === "loader") {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          className
        )}
      >
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            <p className="text-sm font-medium text-muted-foreground">
              {text || "載入中..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "router") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            <div className="absolute inset-0 animate-ping">
              <Loader2 className={cn("text-primary/20", sizeClasses[size])} />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {text || "頁面跳轉中..."}
          </p>
        </div>
      </div>
    );
  }

  if (type === "skeleton") {
    if (skeletonVariant === "card") {
      return (
        <div className={cn("space-y-4", className)}>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      );
    }

    if (skeletonVariant === "list") {
      return (
        <div className={cn("space-y-3", className)}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (skeletonVariant === "table") {
      return (
        <div className={cn("space-y-3", className)}>
          <Skeleton className="h-10 w-full" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && (
          <p className="text-sm font-medium text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}
