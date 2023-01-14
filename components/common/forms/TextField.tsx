import clsx from "clsx";
import React, { forwardRef, InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: any;
  labelClassName: string | undefined;
  rounded: boolean;
}

const TextField = forwardRef<HTMLInputElement, Partial<TextFieldProps>>(
  (props, ref) => {
    const {
      className,
      id,
      label,
      register,
      error = false,
      helperText,
      rounded = true,
      labelClassName,
      ...otherProps
    } = props;
    const registerAttr = register ? register(props.name ?? "") : {};
    return (
      <div className="mb-3">
        {label && (
          <InputLabel error={error} htmlFor={id} className={labelClassName}>
            {label}
          </InputLabel>
        )}
        <input
          {...otherProps}
          autoComplete="off"
          id={id}
          className={clsx(
            "w-full py-2 px-4 focus:outline-none border-2 border-black",
            className,
            [error && "border border-red-500"],
            [rounded && "rounded-full"],
            [!rounded && "rounded-lg"]
          )}
          {...registerAttr}
        />
        {helperText && (
          <Typography className="text-red-500 text-medium" variant="small">
            {helperText}
          </Typography>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
