import { Button, TextField } from "components/common";
import { PasswordTextField } from "components/common/forms";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "service/types";
import { getFormAttribute } from "utils/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./utils";

interface IAccountFormProps {
  user: User;
  onSubmit: (val: any) => void;
}

function AccountForm(props: IAccountFormProps) {
  const { user, onSubmit = (val) => {} } = props;
  const [defaultValue] = useState(() => {
    const {
      company,
      created_at,
      role,
      email_verified_at,
      id,
      job_token_temp,
      status,
      registration_token,
      ...otherItem
    } = user;
    return otherItem;
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
  });

  const getFieldAttribute = (
    label: string,
    name: string,
    id: string,
    placeholder?: string
  ) => {
    return {
      ...getFormAttribute(label, name, id, register, errors, user),
      placeholder,
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...getFieldAttribute("Email*", "email", "email")}
        labelAppend="Required fields*"
        labelDescription="Change your current email address"
      />
      <TextField {...getFieldAttribute("Name*", "name", "name")} />
      <PasswordTextField
        {...getFieldAttribute(
          "New Password*",
          "new_password",
          "new_password",
          "Your new password"
        )}
      />
      <PasswordTextField
        {...getFieldAttribute(
          "Confirm New Password*",
          "new_password_confirm",
          "new_password_confirm",
          "Confirm your new password"
        )}
      />
      <PasswordTextField
        {...getFieldAttribute(
          "Current Password*",
          "current_password",
          "current_password",
          "We need your current password to confirm your changes"
        )}
      />
      <div className="flex justify-end">
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}

export default AccountForm;
