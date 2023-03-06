import { Button, TextField, Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CategoryService from "service/category_service";
import { Category } from "service/types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { getFormAttribute } from "utils/form";
import useAlert from "utils/hooks/useAlert";
import { parseErrorMessage } from "utils/api";
import { AuthService } from "service/auth_service";
import { Eye, EyeOff } from "react-feather";
import useJobStore from "components/employers/post-a-job/store/useJobStore";
import JobService from "service/job_service";
import Cookies from "js-cookie";

interface SignUpPageProps {
  categories: Category[];
  sourceRef: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("This field is required"),
  name: yup.string().required("This field is required"),
  password: yup.string().min(6).required("This field is required"),
  confirm_password: yup
    .string()
    .min(6, "Must be at leaset 6 character")
    .oneOf([yup.ref("password"), null], "Password not match"),
});

function SignUpPage(props: SignUpPageProps) {
  const { categories, sourceRef } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  } = useJobStore();

  const { showErrorAlert, showSuccessAlert } = useAlert();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const formAttribute = (label: string, name: string, id: string) => {
    return getFormAttribute(label, name, id, register, errors);
  };

  const onSubmit = async (val: any) => {
    const payload = {
      email: val.email,
      password: val.password,
      name: val.name,
      source: sourceRef,
      job_token: null,
    };
    try {
      setLoading(true);
      if (title) {
        const res = await JobService.createTemp({
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
        });
        const { token } = res.data;
        payload.job_token = token;
        Cookies.remove("job");
      }
      const response = await AuthService.signUpEmployers(payload);
      showSuccessAlert(response.message);
      setLoading(false);
      router.push("/auth/sign-up-success");
    } catch (error) {
      setLoading(false);
      showErrorAlert(parseErrorMessage(error));
    }
  };

  const handleSignInClick = () => {
    router.push("/auth/sign-in");
  };
  return (
    <GuestLayout title="Sign Up" categories={categories}>
      <div className="max-w-5xl mx-auto p-6">
        <Typography
          className="text-center font-bold mb-4 font-palo uppercase lg:text-7xl"
          variant="h1"
        >
          Create an Employer Account
        </Typography>
        <Typography className="text-center mb-4">
          Are you a hiring manager? Manage your job postings and company details
          in one place.
        </Typography>

        <div className="relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-xl w-full mx-auto p-4 bg-gray-100 rounded-lg border-2 border-black">
              <Typography className="text-right">*Required field</Typography>
              <TextField
                type="email"
                {...formAttribute("Email Address*", "email", "email")}
                placeholder="your-company@mail.com"
              />
              <TextField
                placeholder="Company that you're hiring for"
                {...formAttribute("Company Name*", "name", "name")}
              />
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                {...formAttribute("Password*", "password", "password")}
                inputSuffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
              />
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="*********"
                {...formAttribute(
                  "Confirm Password*",
                  "confirm_password",
                  "confirm_password"
                )}
                inputSuffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
              />
            </div>
            <div className="flex flex-col items-center mt-4 gap-2">
              <div>
                <Button isLoading={loading} type="submit" variant="secondary">
                  Create an Employer Account
                </Button>
              </div>
              <Typography>
                Already have an account?{" "}
                <span
                  onClick={handleSignInClick}
                  className="cursor-pointer underline"
                >
                  Sign in here
                </span>
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    sourceRef: context.query.ref || "",
  };

  const categories = await (await CategoryService.gets()).data;
  props.categories = categories;

  return {
    props,
  };
};

export default SignUpPage;
