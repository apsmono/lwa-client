import clsx from "clsx";
import { Typography } from "components/common";
import Feature from "components/home/featured-job/Feature";
import Image from "next/image";
import React from "react";
import { Clock, MapPin } from "react-feather";
import { Job } from "service/types";

interface JobSnippetProps {
  job: Job;
  className?: string;
}

function JobSnippet(props: JobSnippetProps) {
  const { job, className } = props;

  return (
    <div className={clsx("flex justify-center gap-2", className)}>
      <div className="relative w-12 h-12">
        <Image
          fill
          src={`${process.env.NEXT_PUBLIC_API_URL}${job.company_logo}`}
          alt="Company logo"
        />
      </div>
      <div>
        <p>
          <span className="font-bold">{job.title}</span> | {job.company_name}
        </p>
        <div className="flex mt-1 gap-2 flex-wrap">
          {job.is_worldwide && (
            <Feature icon={<MapPin size={14} />} title="Worldwide" />
          )}
          <Feature
            icon={
              <Image src="/dollar-circle.svg" alt="$" width={14} height={14} />
            }
            title={job.salary}
          />
          <Feature icon={<Clock size={14} />} title={job.employment_type} />
          <div className="px-4 py-1 border border-black rounded-full">
            <Typography className="text-xs">{job.category_name}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSnippet;
