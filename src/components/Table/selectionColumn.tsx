// selectionColumn.tsx

import type { CheckedState } from "@radix-ui/react-checkbox";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export function createSelectionColumn<T extends RowData>(): ColumnDef<T> {
  return {
    id: "__select",
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected();
      const some = table.getIsSomePageRowsSelected();
      const checked: CheckedState = some && !all ? "indeterminate" : all;
      return (
        <Checkbox
          aria-label="Select all"
          checked={checked}
          onCheckedChange={(val) =>
            table.toggleAllPageRowsSelected(val === true)
          }
        />
      );
    },
    cell: ({ row }) => {
      const selected = row.getIsSelected();
      const some = row.getIsSomeSelected();
      const checked: CheckedState =
        some && !selected ? "indeterminate" : selected;
      return (
        <Checkbox
          aria-label="Select row"
          checked={checked}
          onCheckedChange={(val) => row.toggleSelected(val === true)}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 32,
  };
}
