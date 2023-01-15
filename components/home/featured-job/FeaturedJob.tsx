import SectionTitle from "components/common/SectionTitle";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Job } from "service/types";
import FeaturedJobCard from "./FeaturedJobCard";

interface FeaturedJobProps {
  jobs: Job[];
}

function FeaturedJob({ jobs }: FeaturedJobProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toLeft = () => {
    const current = scrollRef?.current?.scrollLeft || 0;
    scrollRef.current!.scrollLeft = current - 288;
  };
  const toRight = () => {
    const current = scrollRef?.current?.scrollLeft || 0;
    scrollRef.current!.scrollLeft = current + 288;
  };

  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };
  return (
    <div className="flex flex-col">
      <SectionTitle>Featured Jobs</SectionTitle>
      <div className="w-full relative px-6">
        <button className="absolute left-0 top-1/2" onClick={toLeft}>
          <ChevronLeft color="black" />
        </button>
        <div
          className="w-full flex overflow-x-scroll no-scrollbar mt-4"
          ref={scrollRef}
        >
          <div className="flex flex-nowrap gap-4">
            {jobs.map((job) => (
              <FeaturedJobCard
                key={job.id}
                job={job}
                onClick={() => handleClick(job)}
              />
            ))}
          </div>
        </div>
        <button className="absolute right-0 top-1/2" onClick={toRight}>
          <ChevronRight color="black" />
        </button>
      </div>
    </div>
  );
}

export default FeaturedJob;
