import { FieldErrorsImpl, UseFormRegister } from "react-hook-form";
// import { cloneDeep, has, merge } from "lodash";

export const getFormAttribute = (
  label: string,
  name: string,
  id: string,
  register: UseFormRegister<any>,
  errors: FieldErrorsImpl<any>,
  initialValue: any = {}
) => {
  return {
    label,
    name,
    id,
    register,
    error: !!errors[name],
    helperText: errors[name]?.message,
    defaultValue: initialValue[name] ?? "",
  };
};
