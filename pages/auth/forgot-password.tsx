import { Button, TextField, Typography } from "components/common";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getFormAttribute } from "utils/form";
import { AuthService } from "service/auth_service";
import useAlert from "utils/hooks/useAlert";
import { parseErrorMessage } from "utils/api";
import BlankLayout from "components/layout/BlankLayout";
import { AppContext } from "context/appContext";

interface ForgotPasswordPageProps {}

const schema = yup.object().shape({
  email: yup.string().email().required("This field is required"),
});

function ForgotPasswordPage(props: ForgotPasswordPageProps) {
  const router = useRouter();
  const { setLoading } = useContext(AppContext);
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });
  const { showErrorAlert } = useAlert();

  const formAttribute = (label: string, name: string, id: string) => {
    return getFormAttribute(label, name, id, register, errors);
  };

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await AuthService.forgotPassword(val.email);
      setLoading(false);

      router.push("/auth/forgot-password-success");
    } catch (error) {
      setLoading(false);
      showErrorAlert(parseErrorMessage(error));
    }
  };
  return (
    <BlankLayout title="Forgot Password">
      <div className="max-w-5xl mx-auto p-6 min-h-[60vh]">
        <p className="text-center font-bold mb-4 font-palo uppercase text-5xl lg:text-6xl tracking-wide">
          RESET PASSWORD
        </p>
        <Typography className="text-center mb-8">
          Enter the email with your account we’il send an email with <br />
          instructions to reset your password
        </Typography>

        <div className="relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-xl w-full mx-auto p-4">
              <TextField
                type="email"
                placeholder="your-company@mail.com"
                {...formAttribute("Email Address*", "email", "email")}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-xl px-4">
                <Button size="md" type="submit" block>
                  Send Instructions
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BlankLayout>
  );
}

export default ForgotPasswordPage;
