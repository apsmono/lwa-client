import clsx from "clsx";
import React, { forwardRef, TextareaHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
    withShadow = false,
    labelAppend,
    labelDescription,
    ...otherProps
  } = props;
  const registerAttr = register ? register(props.name ?? "") : {};
  return (
    <div className="mb-3">
      {label && (
        <InputLabel
          description={labelDescription}
          append={labelAppend}
          error={error}
          htmlFor={id}
          className={labelClassName}
        >
          {label}
        </InputLabel>
      )}
      <textarea
        autoComplete="off"
        id={id}
        rows={5}
        className={clsx(
          "w-full py-2 px-4 border-[1.5px] border-neutral-500 transition-all",
          className,
          [error && "border-danger-500 focus:border-danger-500"],
          [!error && "focus:outline-neutral-500"],
          [rounded && "rounded-full"],
          [!rounded && "rounded-lg"],
          [withShadow && "with-shadow"]
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
