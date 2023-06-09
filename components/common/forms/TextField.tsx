import clsx from "clsx";
import React, {
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelAppend: string;
  labelDescription: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: any;
  labelClassName: string | undefined;
  rounded: boolean;
  withShadow: boolean;
  inputSuffix: ReactNode;
  inputPrefix: ReactNode;
  containerProps?: HTMLAttributes<HTMLDivElement>;
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
      rounded = false,
      labelClassName,
      withShadow = false,
      labelAppend,
      labelDescription,
      inputSuffix,
      inputPrefix,
      containerProps,
      ...otherProps
    } = props;
    const registerAttr = register ? register(props.name ?? "") : {};
    return (
      <div
        className={clsx("mb-3", containerProps?.className)}
        style={containerProps?.style}
      >
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
        <div
          className={clsx({
            relative: Boolean(inputPrefix) || Boolean(inputSuffix),
          })}
        >
          <input
            ref={ref}
            {...otherProps}
            autoComplete="off"
            id={id}
            className={clsx(
              "w-full py-2 px-4 border border-neutral-500 transition-all",
              className,
              [error && "border-danger-500 focus:border-danger-500"],
              [!error && "focus:outline-neutral-500"],
              [rounded && "rounded-full"],
              [!rounded && "rounded-lg"],
              [withShadow && "with-shadow"],
              [inputPrefix && "pl-9"]
            )}
            {...registerAttr}
          />
          {inputPrefix ? (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-4 flex justify-center">
              {inputPrefix}
            </div>
          ) : null}
          {inputSuffix ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-4 flex justify-center">
              {inputSuffix}
            </div>
          ) : null}
        </div>

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
