import clsx from "clsx";
import React, { ReactNode } from "react";

interface IPageTitleProps {
  children: ReactNode;
  className?: string;
}

function PageTitle(props: IPageTitleProps) {
  const { children, className } = props;
  return (
    <p className={clsx("text-center mb-4 text-5xl font-light", className)}>
      {children}
    </p>
  );
}

export default PageTitle;
