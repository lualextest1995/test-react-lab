import type { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Select from "@/components/Select";

type SharedPaginationProps<T extends object> = {
  table: Table<T>;
  pageSizeOptions?: number[];
};

type PageItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; id: string };

export function SharedPagination<T extends object>({
  table,
  pageSizeOptions = [10, 20, 50, 100],
}: SharedPaginationProps<T>) {
  const { t } = useTranslation();
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const paginationOptionsResult = pageSizeOptions.map((size) => ({
    label: t("page_size", { count: size }),
    value: String(size),
  }));

  // 智慧產生頁碼 (頭尾 + 當前前後 2 頁)
  const getPageItems = (): PageItem[] => {
    const items: PageItem[] = [];
    const delta = 2;

    for (let i = 0; i < pageCount; i++) {
      if (
        i === 0 || // 第一頁
        i === pageCount - 1 || // 最後一頁
        (i >= currentPage - delta && i <= currentPage + delta) // 當前附近
      ) {
        items.push({ type: "page", page: i });
      } else if (items.at(-1)?.type !== "ellipsis") {
        items.push({ type: "ellipsis", id: `ellipsis-${i}` });
      }
    }

    return items;
  };

  return (
    <div className="flex items-center justify-between gap-3 max-sm:flex-col mt-4">
      <p
        className="text-muted-foreground flex-1 text-sm whitespace-nowrap"
        aria-live="polite"
      >
        <Trans
          i18nKey="pagination_info"
          values={{ currentPage: currentPage + 1, total: pageCount }}
          components={[
            <span key="0" className="text-foreground" />,
            <span key="1" className="text-foreground" />,
          ]}
          t={t}
        />
      </p>

      <div className="grow">
        {/* 頁碼 */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label={t("prev_page", {
                  defaultValue: "Go to previous page",
                })}
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {getPageItems().map((item) =>
              item.type === "ellipsis" ? (
                <PaginationItem key={item.id}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${item.page}`}>
                  <PaginationLink
                    onClick={() => table.setPageIndex(item.page)}
                    isActive={currentPage === item.page}
                  >
                    {item.page + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                // aria-label={t("next_page", { defaultValue: "Go to next page" })}
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Page size 選擇器 */}
      <div className="flex flex-1 justify-end">
        <div className="w-30">
          <Select
            value={String(pageSize)}
            onChange={(value) => table.setPageSize(Number(value))}
            options={paginationOptionsResult}
            aria-label={t("page_size_selector", {
              defaultValue: "Select page size",
            })}
          />
        </div>
      </div>
    </div>
  );
}
