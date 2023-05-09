import SectionTitle from "components/common/SectionTitle";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { Job } from "service/types";
import FeaturedJobCard from "./FeaturedJobCard";
import { Typography } from "components/common";
import clsx from "clsx";

interface FeaturedJobProps {
  jobs: Job[];
}

function FeaturedJob({ jobs }: FeaturedJobProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toLeft = () => {
    const current = scrollRef?.current?.scrollLeft || 0;
    scrollRef.current!.scroll({ left: current - 288 * 4, behavior: "smooth" });
  };
  const toRight = () => {
    const current = scrollRef?.current?.scrollLeft || 0;
    scrollRef.current!.scroll({ left: current + 288 * 4, behavior: "smooth" });
  };

  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };
  return (
    <div className="w-full flex pl-6 lg:pl-24">
      <div>
        <p className="font-palo font-extrabold text-3xl md:text-7xl uppercase">
          Featured <br />
          Jobs
        </p>

        <div className="flex gap-2 my-6">
          <button
            className={clsx(
              "md:w-16 md:h-16 bg-neutral-200 rounded-full flex items-center justify-center opacity-60 transition-all",
              "hover:opacity-100",
              "active:opacity-100",
              "w-10 h-10"
            )}
            onClick={toLeft}
          >
            <ArrowLeft />
          </button>
          <button
            className={clsx(
              "md:w-16 md:h-16 bg-neutral-200 rounded-full flex items-center justify-center opacity-60 transition-all",
              "hover:opacity-100",
              "active:opacity-100",
              "w-10 h-10"
            )}
            onClick={toRight}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className="relative pl-6 lg:pl-24 overflow-hidden">
        <div
          className="w-full flex overflow-x-scroll no-scrollbar mt-4"
          ref={scrollRef}
        >
          <div className="flex flex-nowrap gap-4">
            {jobs.map((job, i) => (
              <FeaturedJobCard
                key={job.id}
                job={job}
                onClick={() => handleClick(job)}
                variant={i % 2 === 0 ? "primary" : "secondary"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedJob;
