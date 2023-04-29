import React, { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import RadioButton from "./RadioButton";

interface IRadioProps {
  value?: any;
  options: { label: string; value: any }[];
  name: string;
  error: boolean;
  helperText: any;
  id: string;
  register: UseFormRegister<any>;
  onChange?: (val: any) => void;
  radioSize?: "sm" | "md" | "lg";
}

function Radio(props: IRadioProps) {
  const {
    value,
    name,
    register,
    options,
    error,
    helperText,
    id,
    onChange,
    radioSize,
  } = props;
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (onChange) {
      onChange(val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);
  return (
    <div className="flex gap-4">
      {options.map((opt, i) => (
        <RadioButton
          register={register}
          name={name}
          id={`${id}${i}`}
          key={i}
          value={opt.value}
          label={opt.label}
          error={error}
          helperText={helperText}
          onClick={(newVal) => {
            setVal(newVal);
          }}
          radioSize={radioSize}
          checked={opt.value === val}
        />
      ))}
    </div>
  );
}

export default Radio;
