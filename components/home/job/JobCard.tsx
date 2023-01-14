import clsx from "clsx";
import { Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Clock, MapPin } from "react-feather";
import { Job } from "service/types";
import { timeDiffRelative } from "utils/date";
import Feature from "../featured-job/Feature";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

function JobCard(props: JobCardProps) {
  const { job, onClick } = props;
  return (
    <div
      className={clsx(
        "flex gap-2 justify-between p-4 rounded-lg border border-black flex-wrap cursor-pointer",
        {
          "bg-secondary-300": job.is_featured,
        }
      )}
      onClick={onClick}
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex sm:w-auto w-full justify-center">
          <div className="relative w-12 h-12">
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_API_URL}${job.company_logo}`}
              alt="Company logo"
            />
          </div>
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
                <Image
                  src="/dollar-circle.svg"
                  alt="$"
                  width={14}
                  height={14}
                />
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
      <div className="flex gap-1 flex-col">
        <Typography className="text-xs">
          Posted {timeDiffRelative(new Date(), new Date(job.created_at))}
        </Typography>
        <div className="flex justify-center">
          <div className="py-1 px-2 border border-black rounded-full">
            <Typography className="text-xs">
              {job.is_featured ? "FEATURED" : "NEW"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
