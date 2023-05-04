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
import { getCookie, setCookie } from "cookies-next";
import useAlert from "utils/hooks/useAlert";
import { parseErrorMessage } from "utils/api";
import useAuthStore from "store/useAuthStore";
import { Eye, EyeOff } from "react-feather";
import BlankLayout from "components/layout/BlankLayout";
import { Checkbox } from "components/common/forms";
import Link from "next/link";

interface SignInPageProps {}

const schema = yup.object().shape({
  email: yup.string().email().required("This field is required"),
  password: yup.string().required("This field is required"),
});

function SignInPage(props: SignInPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
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
    const jobString = getCookie("job");
    if (jobString) {
      router.push("/auth/sign-up?ref=post-a-job");
      return;
    }
    router.push("/auth/sign-up");
  };

  const onSubmit = async (val: any) => {
    const payload = { email: val.email, password: val.password };
    const jobString = getCookie("job");
    try {
      setLoading(true);
      const response = await AuthService.signIn(payload);
      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data;
      setCookie("accessToken", accessToken);
      setCookie("refreshToken", refreshToken);

      setAuth({
        accessToken,
        refreshToken,
      });
      showSuccessAlert(response.message);
      setLoading(false);
      if (jobString) {
        router.push("/post-a-job?step=PAYMENT");
      } else {
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      showErrorAlert(parseErrorMessage(error));
    }
  };
  return (
    <BlankLayout title="Sign In">
      <div className="max-w-5xl mx-auto p-6 min-h-[60vh]">
        <p className="text-center font-bold mb-4 font-palo uppercase text-5xl lg:text-6xl tracking-wide">
          Sign in to your Employers Account
        </p>
        <Typography className="text-center mb-8">
          Are you a hiring manager? Manage your job postings and <br /> company
          details in one place.
        </Typography>

        <div className="relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-xl w-full mx-auto p-4">
              <TextField
                type="email"
                placeholder="your-company@mail.com"
                {...formAttribute("Email Address*", "email", "email")}
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
              <div className="flex justify-between">
                <Checkbox label="Remember Me" id="remember-me" />
                <Link href="/forgot-password">
                  <Typography className="font-medium text-primary-500">
                    Forgot Password?
                  </Typography>
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center mt-4 gap-2">
              <div className="w-full max-w-xl px-4">
                <Button size="md" type="submit" isLoading={loading} block>
                  Sign In
                </Button>
              </div>
              <Typography>
                Don&apos;t have an account?{" "}
                <span
                  onClick={handleSignUpClick}
                  className="cursor-pointer underline decoration-primary-500 text-primary-500"
                >
                  Sign up here
                </span>
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </BlankLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default SignInPage;
