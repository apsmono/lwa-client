import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import TextField, { TextFieldProps } from "./TextField";

interface PasswordTextFieldProps extends TextFieldProps {}

function PasswordTextField(props: Partial<PasswordTextFieldProps>) {
  const [open, setOpen] = useState(false);

  return (
    <TextField
      type={open ? "text" : "password"}
      {...props}
      inputSuffix={
        <button type="button" onClick={() => setOpen(!open)}>
          {open ? <EyeOff /> : <Eye />}
        </button>
      }
    />
  );
}

export default PasswordTextField;
