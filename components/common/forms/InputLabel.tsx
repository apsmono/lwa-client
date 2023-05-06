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
      <div className="flex justify-between">
        <Typography className="flex justify-between" variant="h6">
          <span className="font-medium">{children}</span>{" "}
        </Typography>
        {append ? <Typography variant="body">{append}</Typography> : null}
      </div>
      {description ? (
        <Typography variant="xs" className="italic text-neutral-500 mt-1">
          {description}
        </Typography>
      ) : null}
    </label>
  );
}

export default InputLabel;
