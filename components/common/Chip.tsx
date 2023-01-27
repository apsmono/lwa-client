import clsx from "clsx";
import React from "react";
import { X } from "react-feather";

interface ChipPropsInterface {
  children: React.ReactNode;
  onClose: () => void;
  variant: "primary" | "secondary" | "white";
}

function Chip(props: Partial<ChipPropsInterface>) {
  const { variant = "white", children, onClose } = props;
  const styles = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    white: "bg-white border-2 border-black with-shadow",
  };
  return (
    <span
      className={clsx(
        "bg-opacity-70 py-1 px-2 inline-flex gap-1 rounded-full",
        styles[variant]
      )}
    >
      {children}
      <button onClick={onClose}>
        <X size={18} />
      </button>
    </span>
  );
}

export default Chip;
