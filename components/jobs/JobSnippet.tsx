import clsx from "clsx";
import { Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import { CompanyLogoProps } from "components/employers/company/CompanyLogo";
import Feature from "components/home/featured-job/Feature";
import React from "react";
import { Job } from "service/types";
import { currencyFormat, CURRENCY_FORMAT_DEFAULT_CONFIG } from "utils/number";

interface JobSnippetProps {
  job: Partial<Job>;
  className: string;
  companyLogoProps?: CompanyLogoProps;
}

function JobSnippet(props: Partial<JobSnippetProps>) {
  const { job, className, companyLogoProps } = props;

  return (
    <div
      className={clsx(
        "flex justify-center gap-2 flex-col md:items-center sm:flex-row sm:items-start",
        className
      )}
    >
      <CompanyLogo {...companyLogoProps} src={job?.company_logo} />
      <div className="flex flex-col gap-1">
        <Typography className="font-bold" variant="h5">
          {job?.title || "-"}
        </Typography>
        <p>{job?.company_name}</p>
        <div className="flex mt-1 gap-2 flex-wrap">
          <Feature
            className="border border-primary-500"
            icon={<Typography>🌏</Typography>}
            title={job?.is_worldwide ? "Worldwide" : job?.location || "-"}
          />
          <Feature
            className="border border-primary-500"
            icon={<Typography>💰</Typography>}
            title={job?.salary || ""}
          />
          <Feature
            className="border border-primary-500"
            icon={<Typography>🕛</Typography>}
            title={job?.employment_type || "-"}
          />
          <Feature
            title={job?.category_name || "-"}
            className="border border-primary-500"
          />
        </div>
      </div>
    </div>
  );
}

export default JobSnippet;
