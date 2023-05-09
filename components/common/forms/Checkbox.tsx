import clsx from "clsx";
import React, { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: any;
  onClick: (val: any) => void;
  checkboxSize?: "sm" | "md" | "lg";
  variant: "black" | "primary";
}

function Checkbox(props: Partial<CheckboxProps>) {
  const {
    id,
    name,
    className,
    label,
    value,
    register,
    error = false,
    helperText,
    checked,
    onClick = () => {},
    checkboxSize = "md",
    defaultChecked,
    variant = "primary",
    readOnly,
  } = props;
  const registerAttr = register ? register(props.name ?? "") : {};

  const variantStyles = {
    primary: "text-primary-500 border-primary-500",
    black: "text-black border-black",
  };

  return (
    <div className="mb-3">
      <div className="flex items-center">
        <input
          type="checkbox"
          name={name}
          id={id}
          className={clsx(
            "border form-checkbox",
            ["w-4 h-4" && checkboxSize === "sm"],
            ["w-6 h-6" && checkboxSize === "md"],
            ["w-8 h-8" && checkboxSize === "lg"],
            variantStyles[variant],
            className
          )}
          value={value}
          checked={checked}
          {...registerAttr}
          onClick={(e) => {
            onClick(value);
          }}
          defaultChecked={defaultChecked}
          readOnly={readOnly}
        />
        <InputLabel htmlFor={id} error={error} className="ml-2 mb-0">
          {label}
        </InputLabel>
      </div>
      {helperText && (
        <Typography className="text-red-500 text-medium mt-2" variant="small">
          {helperText}
        </Typography>
      )}
    </div>
  );
}

export default Checkbox;
