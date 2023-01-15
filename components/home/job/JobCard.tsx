import clsx from "clsx";
import { Typography } from "components/common";
import { JobSnippet } from "components/jobs";
import React from "react";
import { Job } from "service/types";
import { timeDiffRelative } from "utils/date";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  showStatus?: boolean;
}

function JobCard(props: JobCardProps) {
  const { job, onClick, showStatus = true } = props;
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
        <JobSnippet job={job} className="sm:w-auto w-full" />
      </div>
      <div className="flex gap-1 flex-col">
        <Typography className="text-xs">
          Posted {timeDiffRelative(new Date(), new Date(job.created_at))}
        </Typography>
        {showStatus && (
          <div className="flex justify-center">
            <div className="py-1 px-2 border border-black rounded-full">
              <Typography className="text-xs">
                {job.is_featured ? "FEATURED" : "NEW"}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobCard;
