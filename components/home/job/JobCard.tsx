import clsx from "clsx";
import { Typography } from "components/common";
import { JobSnippet } from "components/jobs";
import React from "react";
import { Job } from "service/types";
import { dateFormat, timeDiffRelative } from "utils/date";
import styles from "./JobCard.module.css";
import Feature from "../featured-job/Feature";

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
        "flex gap-2 justify-between px-6 py-4 rounded-xl border-2 border-primary-500 flex-wrap cursor-pointer transition-all",
        styles["job-card"]
      )}
      onClick={onClick}
    >
      <div className="flex flex-wrap gap-4">
        <JobSnippet
          companyLogoProps={{ size: "md" }}
          job={job}
          className="sm:w-auto w-full gap-4 md:px-4 py-1"
        />
      </div>
      <div className="flex gap-4 items-center">
        {showStatus && (
          <div>
            <Feature
              title="Featured"
              className="bg-primary-800 bg-opacity-100 text-white"
            />
          </div>
        )}
        <Typography className="text-xs">
          {dateFormat(job.created_at, { day: "2-digit", month: "short" })}
        </Typography>
      </div>
    </div>
  );
}

export default JobCard;
