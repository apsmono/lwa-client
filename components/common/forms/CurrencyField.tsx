import clsx from "clsx";
import React, { InputHTMLAttributes, useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { currencyFormat, parseLocaleNumber } from "utils/number";

import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface CurrencyFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error: boolean;
  helperText: any;
  rounded: boolean;
  labelClassName: string;
  onValueChange: (val: number) => void;
  register: UseFormRegister<any>;
  withShadow: boolean;
  labelDescription: string;
}

function CurrencyField(props: Partial<CurrencyFieldProps>) {
  const {
    label,
    className,
    error,
    helperText,
    rounded,
    id,
    name,
    labelClassName,
    type,
    defaultValue = 0,
    onValueChange = (val) => {},
    register,
    withShadow,
    labelDescription,
    ...otherProps
  } = props;
  const registerAttr = register ? register(props.name ?? "") : {};

  const num = useRef<number>(+defaultValue);
  const [formattedNumber, setFormattedNumber] = useState(
    currencyFormat(+defaultValue, {
      currency: "USD",
      style: "currency",
      currencyDisplay: "none",
    })
  );

  const handleChange = (str: string) => {
    num.current = parseLocaleNumber(str);
    setFormattedNumber(new Intl.NumberFormat("en-US").format(num.current));
    onValueChange(num.current);
  };
  return (
    <div className="mb-3">
      {label && (
        <InputLabel
          description={labelDescription}
          error={error}
          htmlFor={id}
          className={labelClassName}
        >
          {label}
        </InputLabel>
      )}
      <div className="relative">
        <input
          type={type}
          autoComplete="off"
          id={id}
          className={clsx(
            "w-full py-2 px-4 focus:outline-none border-2 border-black pl-6",
            className,
            [error && "border border-red-500"],
            [rounded && "rounded-full"],
            [!rounded && "rounded-xl"],
            [withShadow && "with-shadow"]
          )}
          name={name}
          value={formattedNumber}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          {...otherProps}
        />
        <div className="absolute left-0 top-1/2 pb-[1.5px] -translate-y-1/2 pl-4 flex justify-center">
          $
        </div>
      </div>
      {name ? <input hidden name={name} {...registerAttr} /> : null}
      {helperText && (
        <Typography className="text-red-500 text-medium" variant="small">
          {helperText}
        </Typography>
      )}
    </div>
  );
}

export default CurrencyField;
