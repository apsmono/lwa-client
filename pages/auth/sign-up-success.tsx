import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
interface ISignUpSuccess {}

function SignUpSuccess(props: ISignUpSuccess) {
  return (
    <GuestLayout title="Sign Up Success">
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <p className="text-6xl lg:text-7xl font-palo font-extrabold uppercase text-center">
          THANK YOU FOR <br /> SIGNING UP!
        </p>
        <div className="max-w-2xl mt-4">
          <Typography className="text-center">
            Please check your email and click the link on the email for{" "}
            <span className="underline">verification</span>. <br /> You will be
            redirected back to finish your payment.
          </Typography>
        </div>
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default SignUpSuccess;
