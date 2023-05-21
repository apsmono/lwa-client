import { Button, Typography } from "components/common";

import BlankLayout from "components/layout/BlankLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

function NotFoundPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="p-6">
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="text-6xl">Oops, Sorry!</p>
          <Typography className="mt-3">
            We couldn’t find the page you were looking for. Maybe our FAQ or
            Chat Box can help?
          </Typography>

          <div className="flex justify-center mt-3">
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    </>
  );
}

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return <BlankLayout>{page}</BlankLayout>;
};

export default NotFoundPage;
