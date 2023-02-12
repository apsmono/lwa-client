import clsx from "clsx";
import React, { forwardRef, InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelAppend: string;
  labelDescription: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: any;
  labelClassName: string | undefined;
  rounded: boolean;
  withShadow: boolean;
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
      withShadow = true,
      labelAppend,
      labelDescription,
      ...otherProps
    } = props;
    const registerAttr = register ? register(props.name ?? "") : {};
    return (
      <div className="mb-3">
        {label && (
          <InputLabel
            append={labelAppend}
            description={labelDescription}
            error={error}
            htmlFor={id}
            className={labelClassName}
          >
            {label}
          </InputLabel>
        )}
        <input
          ref={ref}
          {...otherProps}
          autoComplete="off"
          id={id}
          className={clsx(
            "w-full py-2 px-4 focus:outline-none border-2 border-black",
            className,
            [error && "border border-red-500"],
            [rounded && "rounded-full"],
            [!rounded && "rounded-lg"],
            [withShadow && "with-shadow"]
          )}
          {...registerAttr}
        />
        {helperText && (
          <Typography className="text-red-500 text-medium mt-2" variant="small">
            {helperText}
          </Typography>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
