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
  } = props;
  const registerAttr = register ? register(props.name ?? "") : {};

  return (
    <div className="mb-3">
      <div className="flex items-center justify-center">
        <input
          type="radio"
          name={name}
          id={id}
          className={clsx(
            "w-6 h-6 border border-black text-black rounded-full form-checkbox",
            className
          )}
          value={value}
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
