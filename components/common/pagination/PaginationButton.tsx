import React, { useEffect, useState } from "react";
import { ChevronRight } from "react-feather";
import { TextField } from "../forms";
import Typography from "../Typography";

interface IPaginationButtonProps {
  pageData: { totalItems: number; page: string };
  totalPages: number;
  onChange?: (val: string) => void;
}

function PaginationButton(props: IPaginationButtonProps) {
  const { pageData, totalPages, onChange } = props;
  const [page, setPage] = useState(pageData.page);

  useEffect(() => {
    if (onChange) {
      onChange(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return (
    <div className="flex justify-center items-center mt-4 gap-4">
      <TextField
        containerProps={{ className: "mb-0" }}
        className="w-24"
        rounded={false}
        value={page}
        onChange={(e) => setPage(e.target.value)}
        type="number"
      />{" "}
      <Typography>/ {totalPages}</Typography>
      <button
        disabled={+pageData.page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default PaginationButton;
