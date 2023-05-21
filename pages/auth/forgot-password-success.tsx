import { Button, PageTitle, Typography } from "components/common";
import BlankLayout from "components/layout/BlankLayout";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

function ForgotPasswordSuccess() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Forgot Password Success</title>
      </Head>
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <PageTitle>Check Your Email</PageTitle>
        <div className="max-w-2xl mt-4 flex justify-center flex-col gap-4">
          <Typography className="text-center">
            We have sent an email with instructions to reset <br /> your
            password
          </Typography>

          <Button>Check your email</Button>
          <button onClick={() => router.push("/")}>
            Skip, I&apos;ll confirm later
          </button>
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

ForgotPasswordSuccess.getLayout = function getLayout(page: ReactElement) {
  return <BlankLayout>{page}</BlankLayout>;
};

export default ForgotPasswordSuccess;
