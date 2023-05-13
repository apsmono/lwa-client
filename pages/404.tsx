import { Button, Typography } from "components/common";

import BlankLayout from "components/layout/BlankLayout";
import { useRouter } from "next/router";
import React from "react";

function NotFoundPage() {
  const router = useRouter();
  return (
    <BlankLayout title="Page not found">
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
    </BlankLayout>
  );
}

export default NotFoundPage;
