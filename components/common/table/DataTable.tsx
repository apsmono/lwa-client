import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";
import { TextField } from "../forms";
import Typography from "../Typography";
import PaginationButton from "./PaginationButton";
import TableCellSearch from "./TableCellSearch";
import Button from "../Button";
import PageButton from "./PageButton";

interface DataTablePropsInterface {
  fetchItems: (...args: any) => Promise<any>;
  columns: any;
  limit: number;
  page: number;
  refetch: boolean;
  getParams: () => {};
  defaultValue: any[];
  showLimitOption: boolean;
}

function DataTable(props: Partial<DataTablePropsInterface>) {
  const {
    columns,
    fetchItems = () => ({}),
    getParams,
    limit = 10,
    page = 1,
    refetch,
    defaultValue = [],
    showLimitOption,
  } = props;
  const [data, setData] = useState(defaultValue);
  const [pageData, setPageData] = useState({
    totalItems: 0,
    limit,
    page,
  });
  const [loading, setLoading] = useState(false);
  const [columnFilter, setColumnFilter] = useState<any[]>([]);
  const [columnSorting, setColumnSorting] = useState<any[]>([]);

  const totalPages = useMemo(
    () => Math.ceil((pageData?.totalItems || 1) / (pageData?.limit || 1)),
    [pageData?.totalItems, pageData?.limit]
  );

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        let params: any = {
          limit: pageData.limit,
          offset: pageData.page,
        };
        if (getParams) {
          params = {
            ...params,
            ...getParams(),
          };
        }
        if (columnSorting.length) {
          params.sortBy = columnSorting[0].id;
          params.sortDirection = columnSorting[0].desc ? "DESC" : "ASC";
        }
        columnFilter.forEach((cf) => (params[cf.id] = cf.value));
        const response: any = await fetchItems(params);
        if (!active) return;
        const { data, page } = response;
        setData(data ?? []);
        setPageData(page);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    const timeout = setTimeout(() => {
      fetchData();
    }, 1000);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [
    pageData.limit,
    pageData.page,
    columnSorting,
    fetchItems,
    getParams,
    columnFilter,
  ]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilter,
    state: {
      sorting: columnSorting,
    },
    onSortingChange: setColumnSorting,
    defaultColumn: {
      enableSorting: false,
      enableColumnFilter: false,
    },
  });

  const pageList = useMemo(() => {
    if (pageData.page + 2 >= totalPages)
      return [totalPages - 2, totalPages - 1];
    return [pageData.page, pageData.page + 1];
  }, [pageData.page, totalPages]);

  return (
    <>
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="border-b" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="p-2 bg-primary-100" key={header.id}>
                    <div
                      className={clsx("flex flex-wrap text-center", {
                        "cursor-pointer select-none hover:bg-gray-100 p-2":
                          header.column.getCanSort(),
                      })}
                      onClick={() => header.column.toggleSorting()}
                    >
                      <Typography className="text-center w-full text-sm font-medium flex gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted()
                          ? {
                              asc: <ArrowUp size={18} />,
                              desc: <ArrowDown size={18} />,
                            }[header.column.getIsSorted() as string]
                          : null}
                      </Typography>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {!table.getRowModel().rows.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-2 border-b text-sm text-center"
                >
                  No data available
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="p-2 border-b text-sm" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 0 ? (
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2">
            <PaginationButton
              disabled={pageData.page === 1}
              onClick={() =>
                setPageData((val) => ({ ...val, page: val.page - 1 }))
              }
            >
              Prev
            </PaginationButton>
            {pageData.page > 1 ? (
              <>
                <PageButton
                  active={1 === pageData.page}
                  onClick={() => setPageData((val) => ({ ...val, page: 1 }))}
                >
                  1
                </PageButton>
                <span>...</span>
              </>
            ) : null}
            {pageList.map((p) => (
              <PageButton
                key={p}
                active={p === pageData.page}
                onClick={() => setPageData((val) => ({ ...val, page: p }))}
              >
                {p}
              </PageButton>
            ))}
            {totalPages > 3 && pageData.page < totalPages - 2 ? "..." : null}
            <PageButton
              active={totalPages === pageData.page}
              onClick={() =>
                setPageData((val) => ({ ...val, page: totalPages }))
              }
            >
              {totalPages}
            </PageButton>
            <PaginationButton
              disabled={pageData.page === totalPages}
              onClick={() =>
                setPageData((val) => ({ ...val, page: val.page + 1 }))
              }
            >
              Next
            </PaginationButton>
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between flex-wrap">
        {showLimitOption ? (
          <div className="lg:w-auto w-full">
            <select
              className="border p-1"
              value={pageData.limit}
              onChange={(e) => {
                setPageData((val: any) => ({
                  ...val,
                  page: 1,
                  limit: e.target.value,
                }));
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default DataTable;
