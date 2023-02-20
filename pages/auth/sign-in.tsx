import { Button, TextField, Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CategoryService from "service/category_service";
import { Category } from "service/types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getFormAttribute } from "utils/form";
import { AuthService } from "service/auth_service";
import Cookies from "js-cookie";
import useAlert from "utils/hooks/useAlert";
import { parseErrorMessage } from "utils/api";

interface SignInPageProps {
  categories: Category[];
}

const schema = yup.object().shape({
  email: yup.string().email().required("This field is required"),
  password: yup.string().required("This field is required"),
});

function SignInPage(props: SignInPageProps) {
  const { categories } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const formAttribute = (label: string, name: string, id: string) => {
    return getFormAttribute(label, name, id, register, errors);
  };

  const handleSignUpClick = () => {
    router.push("/auth/sign-up");
  };

  const onSubmit = async (val: any) => {
    const payload = { email: val.email, password: val.password };
    try {
      setLoading(true);
      const response = await AuthService.signIn(payload);
      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data;
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      showSuccessAlert(response.message);
      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      showErrorAlert(parseErrorMessage(error));
    }
  };
  return (
    <GuestLayout title="Sign In" categories={categories}>
      <div className="max-w-5xl mx-auto p-6">
        <Typography className="text-center font-bold mb-4" variant="h3">
          Sign in to your Employers Account
        </Typography>
        <Typography className="text-center mb-4">
          Are you a hiring manager? Manage your job postings and company details
          in one place.
        </Typography>

        <div className="relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-xl w-full mx-auto p-4 bg-gray-100 rounded-lg border-2 border-black with-shadow">
              <Typography className="text-right">*Required field</Typography>
              <TextField
                type="email"
                placeholder="your-company@mail.com"
                {...formAttribute("Email Address*", "email", "email")}
              />
              <TextField
                type="password"
                placeholder="*********"
                {...formAttribute("Password*", "password", "password")}
              />
            </div>
            <div className="flex flex-col items-center mt-4 gap-2">
              <div>
                <Button type="submit" isLoading={loading} variant="secondary">
                  Sign In
                </Button>
              </div>
              <Typography>
                Don&apos;t have an account?{" "}
                <span
                  onClick={handleSignUpClick}
                  className="cursor-pointer underline"
                >
                  Sign up here
                </span>
              </Typography>
            </div>
          </form>
          <div className="absolute bottom-0 right-0 hidden md:block">
            <div className="relative w-56 h-80">
              <Image
                src="/sign-in-ilustration.svg"
                fill
                alt="Sign in ilustration"
              />
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};

  const categories = await (await CategoryService.gets()).data;
  props.categories = categories;

  return {
    props,
  };
};

export default SignInPage;
