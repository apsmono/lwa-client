import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import Button from "../Button";

interface PaginationButtonPropsInterface
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled: boolean;
}

function PaginationButton(props: Partial<PaginationButtonPropsInterface>) {
  const { children, disabled, onClick } = props;
  return (
    <Button
      size="sm"
      filled={false}
      className={clsx(
        "border border-primary-500 text-primary-500 hover:text-white",
        {
          "hover:bg-primary-500": !disabled,
        },
        { "text-white": disabled }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default PaginationButton;
