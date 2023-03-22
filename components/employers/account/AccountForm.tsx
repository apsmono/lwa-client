import { Button, TextField } from "components/common";
import { PasswordTextField } from "components/common/forms";
import React from "react";
import { useForm } from "react-hook-form";
import { User } from "service/types";
import { getFormAttribute } from "utils/form";

interface IAccountFormProps {
  user: User;
}

function AccountForm(props: IAccountFormProps) {
  const { user } = props;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: user,
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
    <form>
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
          "confirm_new_password",
          "confirm_new_password",
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
        <Button variant="secondary">Update</Button>
      </div>
    </form>
  );
}

export default AccountForm;
