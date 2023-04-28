import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

export type TButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "link"
  | "black"
  | "white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: "sm" | "md" | "lg";
  rounded: boolean;
  variant: TButtonVariant;
  block: boolean;
  isLoading: boolean;
  withShadow: boolean;
}

function Button(props: Partial<ButtonProps>) {
  const {
    size,
    rounded = true,
    variant,
    onClick,
    children,
    className,
    block = false,
    disabled,
    isLoading = false,
    withShadow = false,
    ...otherProps
  } = props;
  const arrClassNames = [];

  switch (size) {
    case "sm":
      arrClassNames.push("py-1");
      break;
    case "md":
      arrClassNames.push("py-2");
      break;
    case "lg":
      arrClassNames.push("py-4");
      break;
    default:
      arrClassNames.push("py-1");
      break;
  }

  if (rounded) {
    arrClassNames.push("rounded-full");
  } else {
    arrClassNames.push("rounded-lg");
  }

  switch (variant) {
    case "primary":
      arrClassNames.push("bg-primary-500 hover:bg-primary-600");
      break;
    case "secondary":
      arrClassNames.push("bg-secondary-500 hover:bg-secondary-600");
      break;
    case "danger":
      arrClassNames.push("bg-red-500 hover:bg-red-600 text-white");
      break;
    case "link":
      arrClassNames.push(
        "text-blue-500 hover:decoration-blue-500 hover:underline"
      );
      break;
    case "white":
      arrClassNames.push("bg-white");
      break;
    case "black":
      arrClassNames.push("text-white bg-black");
      break;
    default:
      arrClassNames.push("bg-primary-500 hover:bg-primary-600");
  }
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-center px-6 font-medium transition-all cursor-pointer block text-white",
        arrClassNames,
        className,
        [
          (disabled || isLoading) &&
            "bg-gray-400 hover:bg-gray-400 cursor-not-allowed",
        ],
        [block && "w-full"],
        [withShadow && variant !== "link" && "with-shadow"]
      )}
      {...otherProps}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
