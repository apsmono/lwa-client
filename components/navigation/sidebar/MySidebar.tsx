import clsx from "clsx";
import { Backdrop } from "components/common";
import React, { ReactNode } from "react";

interface IMySidebarProps {
  children: ReactNode;
  className?: string;
  open?: boolean;
  backdropProps?: {
    className: string;
    onClick?: () => void;
  };
  withBackdrop?: boolean;
}

function MySidebar(props: IMySidebarProps) {
  const { children, className, open, withBackdrop, backdropProps } = props;
  return (
    <>
      <div
        className={clsx(
          "h-full w-72 visible fixed inset-0 z-10 transition-all duration-300 overflow-y-auto p-6",
          [!open && "-translate-x-80"],
          className
        )}
      >
        {children}
      </div>
      {withBackdrop ? (
        <Backdrop
          show={open}
          onClick={backdropProps?.onClick}
          className={backdropProps?.className}
        />
      ) : null}
    </>
  );
}

export default MySidebar;
