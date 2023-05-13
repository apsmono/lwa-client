import { Typography } from "components/common";
import BlankLayout from "components/layout/BlankLayout";
import { ROUTE_EMPLOYERS_LISTING } from "config/routes";
import { useRouter } from "next/router";
import React from "react";
function PostJobSuccess() {
  const router = useRouter();

  return (
    <BlankLayout
      title="Post Job Success"
      onBack={() => router.push(ROUTE_EMPLOYERS_LISTING)}
    >
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <p className="text-6xl text-center">
          Payment <br /> Accepted
        </p>
        <div className="max-w-2xl mt-4">
          <Typography className="text-center">
            We will notify you in less than 24 hours when your job post is LIVE!
          </Typography>
        </div>
      </div>
    </BlankLayout>
  );
}

export default PostJobSuccess;
