import * as yup from "yup";

export const schema = yup.object({
  apply_link: yup.string().required("This field is required"),
  title: yup.string().required("This field is required"),
  category_id: yup
    .number()
    .typeError("This field is required")
    .required("This field is required"),
  skill: yup.string(),
  language_id: yup
    .number()
    .typeError("This field is required")
    .required("This field is required"),
  employment_type_id: yup
    .number()
    .typeError("This field is required")
    .required("This field is required"),
  is_worldwide: yup.number(),
  location_id: yup
    .number()
    .typeError("This field is required")
    .required("This field is required"),
  timezone: yup.string(),
  salary: yup.string(),
  description: yup.string().required("This field is required"),
});

export const BASE_BLANK_FORM = {
  apply_link: "",
  title: "",
  category_id: null,
  skill: "",
  language_id: null,
  employment_type_id: null,
  is_worldwide: false,
  location_id: null,
  timezone: "",
  salary: "",
  description: "",
};
