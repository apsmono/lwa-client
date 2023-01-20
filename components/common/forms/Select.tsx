import React, { useState } from "react";
import InputLabel from "./InputLabel";
import { UseFormRegister } from "react-hook-form";
import clsx from "clsx";

interface SelectPropsInterface {
  label: string;
  options: { value: any; text: string }[];
  defaultValue: any;
  register: UseFormRegister<any>;
  error: boolean;
  className: string;
}

function Select(props: Partial<SelectPropsInterface>) {
  const { label, options = [], defaultValue, className, error } = props;
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="mb-3">
      {label && <InputLabel>{label}</InputLabel>}
      <select
        className={clsx(
          "border-2 border-black py-1 px-2 rounded-full with-shadow",
          { "border-red-500": error },
          className
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
