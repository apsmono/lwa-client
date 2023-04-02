import { Button, Typography } from "components/common";
import React from "react";

function NotFoundPage() {
  return (
    <div className="p-6">
      <div className="border border-black rounded-lg with-shadow p-6 max-w-4xl mx-auto text-center">
        <Typography variant="h1" className="font-palo font-bol">
          OOPS, SORRY!
        </Typography>
        <Typography className="mt-3">
          We couldn’t find the page you were looking for. Maybe our FAQ or Chat
          Box can help?
        </Typography>

        <div className="flex justify-center mt-3">
          <Button variant="secondary">Go Back</Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
