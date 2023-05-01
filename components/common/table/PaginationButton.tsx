import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface PaginationButtonPropsInterface
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled: boolean;
}

function PaginationButton(props: Partial<PaginationButtonPropsInterface>) {
  const { children, disabled, onClick } = props;
  return (
    <button
      className={clsx("border rounded p-1 hover:bg-gray-100", {
        "bg-gray-200 opacity-70 pointer-events-none": disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default PaginationButton;
