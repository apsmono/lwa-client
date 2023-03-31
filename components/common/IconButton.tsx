import clsx from "clsx";
import React, { ReactNode } from "react";

interface IconButtonProps {
  color: "primary" | "secondary" | "danger";
  contained: boolean;
  className: string;
  onClick: () => void;
  children: ReactNode;
}

function IconButton(props: Partial<IconButtonProps>) {
  const { color, contained, className, onClick, children } = props;

  const styles = [];
  if (contained) {
    switch (color) {
      case "primary":
        styles.push("bg-primary-500 hover:bg-primary-600");
        break;
      case "secondary":
        styles.push("bg-secondary-500 hover:bg-secondary-600");
        break;
      case "danger":
        styles.push("bg-red-500 hover:bg-red-600");
        break;
    }
  }

  return (
    <button
      onClick={onClick}
      className={clsx("rounded-full p-2 transition-all", styles, className)}
    >
      {children}
    </button>
  );
}

export default IconButton;
