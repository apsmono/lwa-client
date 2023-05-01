import React from "react";
import { TextField } from "../forms";
/**
 *
 * @param {column} column instance from createColumnHelper react table
 * @returns
 */
function TableCellSearch({ column }: { column: any }) {
  const columnFilterValue = column.getFilterValue();
  return (
    <TextField
      type="text"
      defaultValue={columnFilterValue ?? ""}
      onChange={(e: any) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
      className="font-normal py-1"
    />
  );
}

export default TableCellSearch;
