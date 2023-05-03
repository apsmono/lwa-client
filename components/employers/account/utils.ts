import * as yup from "yup";

export const schema = yup.object().shape(
  {
    name: yup.string().required("This field is required"),
    email: yup.string().required("This field is required"),
    new_password: yup
      .string()
      .nullable()
      .notRequired()
      .when("new_password", {
        is: (value: string) => value?.length,
        then: (rule: any) => rule.min(3, "at least contain 3 characters"),
      }),
    new_password_confirm: yup
      .string()
      .oneOf([yup.ref("new_password")], "Password do not match"),
    current_password: yup.string().required("This field is required").min(6),
  },
  [["new_password", "new_password"]]
);
