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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
        <div className="relative h-32 w-32">
          {/* 外圈旋轉環 (白色) */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-t-white border-r-white border-b-white/30 border-l-white/30"
            style={{ animationDuration: "1s" }}
          ></div>
          {/* 中圈旋轉環 (反向, 天空藍) */}
          <div
            className="absolute inset-4 animate-spin rounded-full border-4 border-t-sky-400 border-r-sky-400 border-b-sky-400/30 border-l-sky-400/30"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          ></div>
          {/* 內圈旋轉環 (青色) */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500/30 border-l-blue-500/30"
            style={{ animationDuration: "1s" }}
          ></div>
          {/* 中圈旋轉環 (反向) */}
          <div
            className="absolute inset-4 animate-spin rounded-full border-4 border-t-sky-400 border-r-sky-400 border-b-sky-400/30 border-l-sky-400/30"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          ></div>
          {/* 內圈旋轉環 */}
          <div
            className="absolute inset-8 animate-spin rounded-full border-4 border-t-cyan-300 border-r-cyan-300 border-b-cyan-300/30 border-l-cyan-300/30"
            style={{ animationDuration: "0.8s" }}
          ></div>
        </div>
        <div className="mt-8 text-center text-xl font-medium text-white">
          <span className="animate-pulse">載入中...</span>
        </div>
      </div>
    );
  }

  if (type === "router") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-95">
        <div className="relative h-32 w-32">
          {/* 外圈旋轉環 */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500/30 border-l-blue-500/30"
            style={{ animationDuration: "1s" }}
          ></div>
          {/* 中圈旋轉環 (反向) */}
          <div
            className="absolute inset-4 animate-spin rounded-full border-4 border-t-sky-400 border-r-sky-400 border-b-sky-400/30 border-l-sky-400/30"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          ></div>
          {/* 內圈旋轉環 */}
          <div
            className="absolute inset-8 animate-spin rounded-full border-4 border-t-cyan-300 border-r-cyan-300 border-b-cyan-300/30 border-l-cyan-300/30"
            style={{ animationDuration: "0.8s" }}
          ></div>
        </div>
        <div className="mt-8 text-center text-xl font-medium text-white">
          <span className="animate-pulse">載入中...</span>
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
        <Loader2
          className={cn("animate-spin text-primary", sizeClasses[size])}
        />
        {text && (
          <p className="text-sm font-medium text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}
