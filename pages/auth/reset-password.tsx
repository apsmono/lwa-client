import { Button, Typography } from "components/common";
import { PasswordTextField } from "components/common/forms";
import { useForm } from "react-hook-form";
import BlankLayout from "components/layout/BlankLayout";
import { AppContext } from "context/appContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { AuthService } from "service/auth_service";
import { parseErrorMessage } from "utils/api";
import { getFormAttribute } from "utils/form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAlert from "utils/hooks/useAlert";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Must be at least 6 characters")
    .required("This field is required"),
  confirm_password: yup
    .string()
    .min(6, "Must be at least 6 characters")
    .oneOf([yup.ref("password"), null], "Password do not match"),
});

interface IResetPasswordPageProps {
  token: string;
}

function ResetPasswordPage(props: IResetPasswordPageProps) {
  const { token } = props;
  const router = useRouter();
  const { setLoading } = useContext(AppContext);
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const formAttribute = (label: string, name: string, id: string) => {
    return getFormAttribute(label, name, id, register, errors);
  };

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await AuthService.resetPassword({ password: val.password, token });
      setLoading(false);
      showSuccessAlert("Success reset password");
      router.push("/auth/sign-in");
    } catch (error) {
      setLoading(false);
      showErrorAlert(parseErrorMessage(error));
    }
  };
  return (
    <BlankLayout title="Reset Password" onBack={() => router.push("/")}>
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
              <PasswordTextField
                placeholder="6 characters minimum"
                {...formAttribute("Password", "password", "password")}
              />
              <PasswordTextField
                placeholder="6 characters minimum"
                {...formAttribute(
                  "Confirm Password",
                  "confirm_password",
                  "confirm_password"
                )}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-xl px-4">
                <Button size="md" type="submit" block>
                  Reset Password
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BlankLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;
  if (!token) {
    return {
      notFound: true,
    };
  }

  try {
    await AuthService.verifyResetPasswordToken(token.toString());
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token,
    },
  };
};
export default ResetPasswordPage;
