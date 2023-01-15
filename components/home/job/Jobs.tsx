import { Button } from "components/common";
import SectionTitle from "components/common/SectionTitle";
import { useRouter } from "next/router";
import React from "react";
import { Job } from "service/types";
import JobCard from "./JobCard";

interface JobsProps {
  jobs: Job[];
}

function Jobs(props: JobsProps) {
  const { jobs } = props;
  const router = useRouter();
  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };
  return (
    <div className="flex flex-col">
      <SectionTitle>Jobs</SectionTitle>
      {jobs.map((job) => (
        <div className="mb-4" key={job.id}>
          <JobCard onClick={() => handleClick(job)} job={job} />
        </div>
      ))}
      <div className="flex justify-center">
        <Button variant="secondary">View More</Button>
      </div>
    </div>
  );
}

export default Jobs;
