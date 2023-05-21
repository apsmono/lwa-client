import { PageTitle, Typography } from "components/common";
import BlankLayout from "components/layout/BlankLayout";
import { ROUTE_EMPLOYERS_LISTING } from "config/routes";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
function PostJobSuccess() {
  return (
    <>
      <Head>
        <title>Post Job Success</title>
      </Head>
      <div className="flex flex-col items-center">
        <picture className="my-4">
          <img src="/sign-up-success.png" alt="" className="w-28" />
        </picture>
        <PageTitle>
          Payment <br /> Accepted
        </PageTitle>
        <div className="max-w-2xl mt-4">
          <Typography className="text-center">
            We will notify you in less than 24 hours when your job post is LIVE!
          </Typography>
        </div>
      </div>
    </>
  );
}

PostJobSuccess.getLayout = function useGetLayout(page: ReactElement) {
  const router = useRouter();
  return (
    <BlankLayout onBack={() => router.push(ROUTE_EMPLOYERS_LISTING)}>
      {page}
    </BlankLayout>
  );
};

export default PostJobSuccess;
