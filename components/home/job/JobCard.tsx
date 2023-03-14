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
        "flex gap-2 justify-between p-4 rounded-lg border-2 border-black flex-wrap cursor-pointer hover:with-shadow transition-all",
        {
          "bg-secondary-500": job.is_featured,
        }
      )}
      onClick={onClick}
    >
      <div className="flex flex-wrap gap-4">
        <JobSnippet job={job} className="sm:w-auto w-full gap-4 md:px-4 py-1" />
      </div>
      <div className="flex gap-1 flex-col">
        <Typography className="text-xs">
          Posted {timeDiffRelative(new Date(), new Date(job.created_at))}
        </Typography>
        {showStatus && (
          <div className="flex justify-end">
            <div className="py-1 px-4 border border-black rounded-full bg-white">
              <Typography className="text-xs font-medium">
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
