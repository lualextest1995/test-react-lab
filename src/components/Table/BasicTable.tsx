// BasicTable.tsx

import {
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSelectionColumn } from "./selectionColumn";
import type { BasicTableProps } from "./types";
import { getRowIdSafe } from "./utils";

export function BasicTable<T extends object>({
  columns,
  data,
  enableRowSelection = false,
  onRowSelectionChange,
}: BasicTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const finalColumns = enableRowSelection
    ? [createSelectionColumn<T>(), ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: { rowSelection },
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      if (onRowSelectionChange) {
        const selectedRows = table
          .getRowModel()
          .rows.filter((r) => newSelection[r.id])
          .map((r) => r.original as T);
        onRowSelectionChange(selectedRows);
      }
    },
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowIdSafe,
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          {/* <TableFooter>
                        <TableRow>
                            <TableCell colSpan={finalColumns.length}>Table footer</TableCell>
                        </TableRow>
                    </TableFooter> */}
        </Table>
      </div>
    </div>
  );
}
