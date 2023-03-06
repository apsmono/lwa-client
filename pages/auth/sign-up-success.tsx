import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import CategoryService from "service/category_service";
import { Category } from "service/types";

interface ISignUpSuccess {
  categories: Category[];
}

function SignUpSuccess(props: ISignUpSuccess) {
  const { categories } = props;
  return (
    <GuestLayout categories={categories} title="Sign Up Success">
      <div className="flex flex-col items-center">
        <Typography className="lg:text-7xl font-palo font-bold uppercase">
          THANK YOU FOR SIGNING UP!
        </Typography>
        <div className="max-w-2xl mt-4">
          <Typography className="text-center">
            Please check your email and click the link on the email for{" "}
            <span className="underline">verification</span>. <br /> You will be
            redirected back to finish your payment.
          </Typography>
        </div>
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" />
        </picture>
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

export default SignUpSuccess;
