import clsx from "clsx";
import { Button, Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import Feature from "components/home/featured-job/Feature";
import { useRouter } from "next/router";
import React from "react";
import { Job } from "service/types";
import { timeRelative } from "utils/date";
import { CURRENCY_FORMAT_DEFAULT_CONFIG, currencyFormat } from "utils/number";

interface JobDisplayProps {
  job: Partial<Job>;
  className: string;
  showLearnMore: boolean;
}

function JobDisplay(props: Partial<JobDisplayProps>) {
  const { job, className, showLearnMore = true } = props;

  const router = useRouter();
  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2 mb-4">
        <div className="flex gap-4 items-center">
          <CompanyLogo src={job?.company_logo} size="lg" />
          <div>
            <Typography className="font-bold" variant="h5">
              {job?.title}
            </Typography>
            <Typography className="my-1">{job?.company_name}</Typography>
            <Typography variant="small" className="text-neutral-500">
              {timeRelative(
                new Date(),
                new Date(job?.created_at || new Date())
              )}
            </Typography>
          </div>
        </div>
        <div className="min-w-[140px]">
          <Button
            filled={false}
            className="bg-primary-800 hover:bg-primary-900"
            block
          >
            Apply
          </Button>
        </div>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Feature
          className="border border-primary-500"
          icon={<Typography>🌏</Typography>}
          title={job?.is_worldwide ? "Worldwide" : job?.location || "-"}
        />
        <Feature
          className="border border-primary-500"
          icon={<Typography>💰</Typography>}
          title={currencyFormat(job?.salary || 0, {
            ...CURRENCY_FORMAT_DEFAULT_CONFIG,
            notation: "compact",
          })}
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
      <Typography className="whitespace-pre-line text-justify">
        {job?.description || "-"}
      </Typography>

      <div className="border border-neutral-800 rounded-2xl p-4 my-4">
        <Typography className="font-bold mb-3" variant="h5">
          What the company offer:
        </Typography>
        <Typography className="whitespace-pre-line">
          {job?.company_offer ?? "-"}
        </Typography>
      </div>
      <div className="rounded-2xl bg-primary-500 text-neutral-800">
        <div className="p-4 py-6">
          <div className="flex mb-4 gap-4 items-center">
            <CompanyLogo src={job?.company_logo} className="w-14 h-14" />
            <Typography className="font-bold" variant="h4">
              {job?.company_name || "-"}
            </Typography>
          </div>
          <Typography className="font-bold mb-3" variant="h5">
            About Us:
          </Typography>
          <Typography className="whitespace-pre-line text-justify font-medium">
            {job?.company_about || "-"}
          </Typography>
          {showLearnMore ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default JobDisplay;
