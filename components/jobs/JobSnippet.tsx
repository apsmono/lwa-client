import clsx from "clsx";
import { Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import Feature from "components/home/featured-job/Feature";
import Image from "next/image";
import React from "react";
import { Clock, MapPin } from "react-feather";
import { Job } from "service/types";

interface JobSnippetProps {
  job: Partial<Job>;
  className: string;
}

function JobSnippet(props: Partial<JobSnippetProps>) {
  const { job, className } = props;

  return (
    <div
      className={clsx(
        "flex justify-center gap-2 flex-col items-center sm:flex-row sm:items-start",
        className
      )}
    >
      <CompanyLogo src={job?.company_logo} />
      <div>
        <p>
          <span className="font-bold">{job?.title || "-"}</span> |{" "}
          {job?.company_name || "-"}
        </p>
        <div className="flex mt-1 gap-2 flex-wrap">
          <Feature icon={<MapPin size={14} />} title={job?.location || "-"} />
          <Feature
            icon={
              <Image src="/dollar-circle.svg" alt="$" width={14} height={14} />
            }
            title={job?.salary || "-"}
          />
          <Feature
            icon={<Clock size={14} />}
            title={job?.employment_type || "-"}
          />
          <div className="px-4 py-1 border border-black rounded-full">
            <Typography className="text-xs">
              {job?.category_name || "-"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSnippet;
