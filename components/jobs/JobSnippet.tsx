import clsx from "clsx";
import { Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import Feature from "components/home/featured-job/Feature";
import React from "react";
import { Job } from "service/types";
import { currencyFormat, CURRENCY_FORMAT_DEFAULT_CONFIG } from "utils/number";

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
          <Feature
            icon={<Typography>🌏</Typography>}
            title={job?.is_worldwide ? "Worldwide" : job?.location || "-"}
          />
          <Feature
            icon={<Typography>💰</Typography>}
            title={currencyFormat(job?.salary || 0, {
              ...CURRENCY_FORMAT_DEFAULT_CONFIG,
              notation: "compact",
            })}
          />
          <Feature
            icon={<Typography>🕛</Typography>}
            title={job?.employment_type || "-"}
          />
          <div className="px-4 py-1 bg-white border border-black rounded-full flex items-center">
            <Typography variant="small" className="text-xs">
              {job?.category_name || "-"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSnippet;
