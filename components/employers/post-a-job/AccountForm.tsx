import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Typography } from "components/common";
import { PasswordTextField } from "components/common/forms";
import { useRouter } from "next/router";
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { getFormAttribute } from "utils/form";
import * as yup from "yup";
import useJobStore from "./store/useJobStore";
import { setCookie } from "cookies-next";

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("This field is required"),
  password: yup.string().min(6).required("This field is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Password not match"),
});

export type TAccountFormRef = {
  handleSubmit: () => Promise<unknown>;
  getFormData: () => { email: string; password: string };
};

interface IAccountFormProps {}

const AccountForm = forwardRef<TAccountFormRef, IAccountFormProps>(
  (props, ref) => {
    const {
      handleSubmit,
      register,
      getValues,
      formState: { errors },
      setError,
    } = useForm({
      resolver: yupResolver(schema),
    });

    const {
      title,
      description,
      apply_link,
      category_id,
      company_about,
      company_email,
      company_headquarter,
      company_logo,
      company_url,
      company_offer,
      employment_type_id,
      is_worldwide,
      location_id,
      salary,
      package_id,
      company_name,
      employment_type,
      location,
      category_name,
    } = useJobStore();

    const router = useRouter();

    const formAttribute = (label: string, name: string, id: string) => {
      return getFormAttribute(label, name, id, register, errors);
    };
    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: () => {
          return Promise.all([
            new Promise((res, rej) => handleSubmit(res, rej)()),
            new Promise((res, rej) => {
              setTimeout(() => {
                const val = { ...getValues() };
                const emailDomain = val.email.split("@")[1] || "";

                if (!company_url?.includes(emailDomain)) {
                  setError(
                    "email",
                    {
                      message: "Email must contain company url",
                      type: "required",
                    },
                    { shouldFocus: true }
                  );
                  rej({
                    email: {
                      message: "Email must contain company url",
                    },
                  });
                }
                res("");
              }, 500);
            }),
          ]);
        },
        getFormData: () => {
          const val = getValues();
          return {
            email: val.email,
            password: val.password,
          };
        },
      }),
      [company_url, getValues, handleSubmit, setError]
    );

    const handleSignInClick = () => {
      setCookie(
        "job",
        JSON.stringify({
          title,
          description,
          apply_link,
          category_id,
          company_about,
          company_email,
          company_headquarter,
          company_logo,
          company_url,
          company_offer,
          employment_type_id,
          is_worldwide,
          location_id,
          salary,
          package_id,
          company_name,
          employment_type,
          location,
          category_name,
        })
      );
      router.push("/auth/sign-in");
    };
    return (
      <>
        <Typography className="font-bold font-palo" variant="h3">
          CREATE YOUR EMPLOYER ACCOUNT
        </Typography>
        <div className="border-2 border-black p-4 rounded-lg">
          <TextField
            {...formAttribute("Email Address*", "email", "email")}
            type="email"
            labelAppend="Required fields*"
          />
          <PasswordTextField
            {...formAttribute("Create Password*", "password", "password")}
            placeholder="6 characters minimum"
          />
          <PasswordTextField
            {...formAttribute(
              "Confirm Password*",
              "confirm_password",
              "confirm_password"
            )}
            placeholder="6 characters minimum"
          />
        </div>
        <Typography className="text-center">
          Already have an account?{" "}
          <span
            onClick={handleSignInClick}
            className="cursor-pointer underline"
          >
            Sign in here
          </span>
        </Typography>
      </>
    );
  }
);

AccountForm.displayName = "AccountForm";

export default AccountForm;
