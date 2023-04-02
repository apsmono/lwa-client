import clsx from "clsx";
import React, { ReactNode } from "react";
import Typography from "./Typography";

interface CardTitlePropsInterface {
  children: ReactNode;
  className: string;
}

function CardTitle(props: Partial<CardTitlePropsInterface>) {
  const { children, className } = props;
  return (
    <Typography variant="h4" className={clsx("font-medium mb-4", className)}>
      {children}
    </Typography>
  );
}

export default CardTitle;
