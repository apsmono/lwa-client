import clsx from "clsx";
import React, { LabelHTMLAttributes } from "react";
import Typography from "../Typography";

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  error: boolean;
  append: string;
  description: string;
}

function InputLabel(props: Partial<InputLabelProps>) {
  const { htmlFor, children, className, error, append, description } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "text-lg mb-2 block",
        [error && "text-red-500"],
        className
      )}
    >
      <Typography className="flex justify-between" variant="body">
        <span className="font-medium">{children}</span>{" "}
        {append && <span>{append}</span>}
      </Typography>
      {description && (
        <Typography variant="small" className="italic">
          {description}
        </Typography>
      )}
    </label>
  );
}

export default InputLabel;
