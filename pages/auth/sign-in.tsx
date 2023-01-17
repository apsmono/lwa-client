import { Button, TextField, Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import CategoryService from "service/category_service";
import { Category } from "service/types";

interface SignInPageProps {
  categories: Category[];
}

function SignInPage(props: SignInPageProps) {
  const { categories } = props;
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push("/auth/sign-up");
  };
  return (
    <GuestLayout title="Sign In" categories={categories}>
      <div className="max-w-5xl mx-auto p-6">
        <Typography className="text-center font-bold" variant="h3">
          Sign in to your Employers Account
        </Typography>
        <Typography className="text-center mb-4">
          Are you a hiring manager? Manage your job postings and company details
          in one place.
        </Typography>

        <div className="relative">
          <div className="max-w-xl w-full mx-auto p-4 bg-gray-100 rounded-lg border-2 border-black with-shadow">
            <Typography className="text-right">* is required field</Typography>
            <TextField
              label="Email Address *"
              type="email"
              placeholder="your-company@mail.com"
            />
            <TextField
              label="Password *"
              type="password"
              placeholder="*********"
            />
          </div>
          <div className="flex flex-col items-center mt-4 gap-2">
            <div>
              <Button variant="secondary">Sign In</Button>
            </div>
            <Typography>
              Din&apos;t have an account?{" "}
              <span
                onClick={handleSignUpClick}
                className="cursor-pointer underline"
              >
                Sign up here
              </span>
            </Typography>
          </div>
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
