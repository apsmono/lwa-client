import clsx from "clsx";
import React, { ReactNode } from "react";
import Typography from "../Typography";

interface IPageTitleProps {
  children: ReactNode;
  className?: string;
}

function PageTitle(props: IPageTitleProps) {
  const { children, className } = props;
  return (
    <Typography
      variant="h2"
      className={clsx(
        "font-palo font-bold tracking-wide uppercase mb-3",
        className
      )}
    >
      {children}
    </Typography>
  );
}

export default PageTitle;
