import * as yup from "yup";

export const BASE_BLANK_FORM = {
  company_name: "",
  company_url: "",
  company_id: 0,
  company_about: "",
  company_offer: "",
  company_email: "",
  company_headquarter: "",
};

export const schema = yup.object({
  company_name: yup.string().required("This field is required"),
  company_email: yup
    .string()
    .email("Must be an valid email")
    .required("This field is required"),
  company_headquarter: yup.string().required("This field is required"),
  company_url: yup.string().required("This field is required"),
  company_about: yup.string().required("This field is required"),
  company_offer: yup.string(),
});
