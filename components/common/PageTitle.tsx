import clsx from "clsx";
import React, { ReactNode } from "react";

interface IPageTitleProps {
  children: ReactNode;
  className?: string;
}

function PageTitle(props: IPageTitleProps) {
  const { children, className } = props;
  return (
    <p
      className={clsx(
        "font-palo font-bold tracking-wide text-center mb-4 text-5xl lg:text-7xl",
        className
      )}
    >
      {children}
    </p>
  );
}

export default PageTitle;
