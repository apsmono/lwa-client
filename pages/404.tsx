import { Button, Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { useRouter } from "next/router";
import React from "react";

function NotFoundPage() {
  const router = useRouter();
  return (
    <GuestLayout title="Page not found">
      <div className="p-6">
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="font-palo font-bold text-6xl">OOPS, SORRY!</p>
          <Typography className="mt-3">
            We couldn’t find the page you were looking for. Maybe our FAQ or
            Chat Box can help?
          </Typography>

          <div className="flex justify-center mt-3">
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

export default NotFoundPage;
