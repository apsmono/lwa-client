import clsx from "clsx";
import React, { forwardRef, TextareaHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: any;
  labelClassName: string | undefined;
  rounded: boolean;
}

const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  Partial<TextAreaFieldProps>
>((props, ref) => {
  const {
    className,
    id,
    label,
    register,
    error = false,
    helperText,
    rounded,
    labelClassName,
    ...otherProps
  } = props;
  const registerAttr = register ? register(props.name ?? "") : {};
  return (
    <div className="mb-4">
      {label && (
        <InputLabel error={error} htmlFor={id} className={labelClassName}>
          {label}
        </InputLabel>
      )}
      <textarea
        autoComplete="off"
        id={id}
        rows={5}
        className={clsx(
          "w-full py-3 px-6 focus:outline-none",
          className,
          [error && "border border-red-500"],
          [rounded && "rounded-full"],
          [!rounded && "rounded-xl"]
        )}
        {...otherProps}
        {...registerAttr}
      />
      {helperText && (
        <Typography className="text-red-500 text-medium" variant="small">
          {helperText}
        </Typography>
      )}
    </div>
  );
});

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
