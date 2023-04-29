import { Typography } from "components/common";
import { ROUTE_EMPLOYERS_LISTING } from "config/routes";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { X } from "react-feather";
import useAuthStore from "store/useAuthStore";

function PostJobSuccess() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const onBackButtonClick = () => {
    if (accessToken) {
      router.push(ROUTE_EMPLOYERS_LISTING);
      return;
    }
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Post Job Success</title>
      </Head>
      <div className="flex justify-between p-6 items-center">
        <picture>
          <img
            src="/lwa-logo.png"
            alt="Logo"
            className="h-10 cursor-pointer"
            onClick={() => router.push("/")}
          />
        </picture>

        <button onClick={onBackButtonClick}>
          <X />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <p className="text-6xl lg:text-7xl font-palo font-extrabold uppercase text-center">
          PAYMENT <br /> ACCEPTED
        </p>
        <div className="max-w-2xl mt-4">
          <Typography className="text-center">
            We will notify you in less than 24 hours when your job post is LIVE!
          </Typography>
        </div>
      </div>
    </>
  );
}

export default PostJobSuccess;
