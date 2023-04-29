import clsx from "clsx";
import React, { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: any;
  onClick: (val: any) => void;
  radioSize?: "sm" | "md" | "lg";
}

function RadioButton(props: Partial<RadioButtonProps>) {
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
    radioSize = "md",
    defaultChecked,
  } = props;
  const registerAttr = register ? register(props.name ?? "") : {};

  return (
    <div className="mb-3">
      <div className="flex items-center" onClick={() => onClick(value)}>
        <input
          type="radio"
          name={name}
          id={id}
          className={clsx(
            "border border-black text-black rounded-full form-checkbox",
            { "w-4 h-4": radioSize === "sm" },
            { "w-6 h-6": radioSize === "md" },
            { "w-8 h-8": radioSize === "lg" },
            className
          )}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          {...registerAttr}
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

export default RadioButton;
