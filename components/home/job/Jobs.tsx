import { Button } from "components/common";
import SectionTitle from "components/common/SectionTitle";
import { AppContext } from "context/appContext";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import JobService from "service/job_service";
import { Job } from "service/types";
import JobCard from "./JobCard";

interface JobsProps {
  jobs: Job[];
  totalItems: number;
}

function Jobs(props: JobsProps) {
  const { jobs, totalItems } = props;
  const router = useRouter();
  const [items, setItems] = useState(jobs);
  const [offset, setOffset] = useState(2);
  const { setLoading } = useContext(AppContext);
  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const handleShowMoreJobs = async () => {
    try {
      setLoading(true);
      const res = await JobService.gets({ offset, limit: 7 });
      const itemCopy = [...items, ...res.data];
      setItems(itemCopy);
      setOffset((oldVal) => oldVal + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <SectionTitle>Jobs</SectionTitle>
      {items.map((job) => (
        <div className="mb-4" key={job.id}>
          <JobCard onClick={() => handleClick(job)} job={job} />
        </div>
      ))}
      {totalItems > items.length && (
        <div className="flex justify-center">
          <Button onClick={handleShowMoreJobs} variant="black">
            View More
          </Button>
        </div>
      )}
    </div>
  );
}

export default Jobs;
