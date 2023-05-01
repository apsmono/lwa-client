import clsx from "clsx";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface IPageButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled: boolean;
  active: boolean;
}

function PageButton(props: Partial<IPageButtonInterface>) {
  const { children, disabled, onClick, active } = props;

  return (
    <button
      className={clsx(
        "border border-primary-500 w-9 rounded-full transition-all",
        "hover:bg-primary-500 hover:text-white",
        { "bg-primary-500 text-white": active },
        { "text-primary-500": !active }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default PageButton;
