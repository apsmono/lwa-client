import { Button } from "components/common";
import SectionTitle from "components/common/SectionTitle";
import { AppContext } from "context/appContext";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import JobService from "service/job_service";
import { Category, Job } from "service/types";
import Subscribe from "../Subscribe";
import JobCard from "./JobCard";

interface JobsProps {
  jobs: Job[];
  totalItems: number;
  categories: Category[];
}

function Jobs(props: JobsProps) {
  const { jobs, totalItems, categories } = props;
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
      {items.map((job, i) => (
        <React.Fragment key={job.id}>
          <div className="mb-4">
            <JobCard onClick={() => handleClick(job)} job={job} />
          </div>
          {(i + 1) % 10 === 0 ? (
            <Subscribe
              className="mb-4 rounded-lg border-2 border-black"
              categories={categories}
            />
          ) : null}
        </React.Fragment>
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
