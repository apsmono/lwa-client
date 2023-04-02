import { AppContext } from "context/appContext";
import { setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { AuthService } from "service/auth_service";
import useAuthStore from "store/useAuthStore";

function VerifyPage({
  token,
  redirectTo,
}: {
  token: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setLoading } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await AuthService.signInByRegistrationToken(token);
      const { access_token: accessToken, refresh_token: refreshToken } =
        response.data;
      setCookie("accessToken", accessToken);
      setCookie("refreshToken", refreshToken);
      setAuth({
        accessToken,
        refreshToken,
      });
      setLoading(false);
      router.replace(redirectTo);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>Your account has been verified</p>
      <p>Redirecting</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token, ref } = context.query;
  if (!token) {
    return {
      notFound: true,
    };
  }
  try {
    await AuthService.verify(token as string);
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      token,
      redirectTo: ref === "post-a-job" ? "/post-a-job?step=PAYMENT" : "/",
    },
  };
};

export default VerifyPage;
