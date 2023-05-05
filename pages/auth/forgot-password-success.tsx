import { Button, Typography } from "components/common";
import BlankLayout from "components/layout/BlankLayout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

function ForgotPasswordSuccess() {
  const router = useRouter();
  return (
    <BlankLayout title="Sign Up Success">
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <p className="text-6xl lg:text-7xl font-palo font-extrabold uppercase text-center">
          CHECK YOUR EMAIL
        </p>
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
    </BlankLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default ForgotPasswordSuccess;
