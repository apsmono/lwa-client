import { PageTitle, Typography } from "components/common";
import BlankLayout from "components/layout/BlankLayout";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { ReactElement } from "react";
interface ISignUpSuccess {}

function SignUpSuccess(props: ISignUpSuccess) {
  return (
    <>
      <Head>
        <title>Sign Up Success</title>
      </Head>
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <PageTitle>
          Thank You For <br /> Signin Up!
        </PageTitle>
        <div className="max-w-2xl mt-4">
          <Typography className="text-center">
            Please check your email and click the link on the email for{" "}
            <span className="underline">verification</span>. <br /> You will be
            redirected back to finish your payment.
          </Typography>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

SignUpSuccess.getLayout = function getLayout(page: ReactElement) {
  return <BlankLayout>{page}</BlankLayout>;
};

export default SignUpSuccess;
