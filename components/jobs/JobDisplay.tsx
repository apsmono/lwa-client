import clsx from "clsx";
import { Button, Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Job } from "service/types";
import JobSnippet from "./JobSnippet";

interface JobDisplayProps {
  job: Partial<Job>;
  className: string;
}

function JobDisplay(props: Partial<JobDisplayProps>) {
  const { job, className } = props;

  const router = useRouter();
  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
        <JobSnippet job={job} className="sm:flex-row flex-col items-center" />
        <div className="min-w-[140px]">
          <Button variant="secondary" className="md:w-auto w-full">
            Apply Now
          </Button>
        </div>
      </div>
      <Typography className="whitespace-pre-line text-justify">
        {job?.description || "-"}
      </Typography>

      <div className="border-2 border-black rounded-lg p-4 with-shadow">
        <Typography className="font-bold">What the company offer:</Typography>
        <Typography className="whitespace-pre-line">
          {job?.company_offer ?? "-"}
        </Typography>
      </div>
      <div className="border-2 border-black rounded-lg bg-primary-500 with-shadow">
        <div className="p-4">
          <div className="flex mb-4 gap-4 items-center">
            <CompanyLogo src={job?.company_logo} className="w-14 h-14" />
            <Typography className="font-bold" variant="h4">
              {job?.company_name || "-"}
            </Typography>
          </div>
          <Typography className="font-bold">About Us:</Typography>
          <Typography className="whitespace-pre-line text-justify">
            {job?.company_about || "-"}
          </Typography>
          <div className="flex justify-end">
            <div>
              <Button
                onClick={() => {
                  if (job?.company_id) {
                    router.push(`/companies/${job!.company_id}`);
                  }
                }}
                variant="link"
                className="text-black"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDisplay;
