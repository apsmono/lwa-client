import clsx from "clsx";
import React, { ReactNode } from "react";

interface CardPropsInterface {
  className: string;
  children: ReactNode;
}

function Card(props: Partial<CardPropsInterface>) {
  const { children, className } = props;
  return (
    <div
      className={clsx("bg-white rounded-md p-4 shadow-sm border", className)}
    >
      {children}
    </div>
  );
}

export default Card;
