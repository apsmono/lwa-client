import { Typography } from "components/common";
import SectionTitle from "components/common/SectionTitle";
import Image from "next/image";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "react-feather";
import { Job } from "service/types";
import Feature from "./Feature";

interface FeaturedJobProps {
  jobs: Job[];
}

function FeaturedJob({ jobs }: FeaturedJobProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const toLeft = () => {
    const current = scrollRef?.current?.scrollLeft || 0;
    scrollRef.current!.scrollLeft = current - 288;
  };
  const toRight = () => {
    const current = scrollRef?.current?.scrollLeft || 0;
    scrollRef.current!.scrollLeft = current + 288;
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
              <div
                key={job.id}
                className="w-72 py-4 bg-secondary-400 bg-opacity-50 rounded-xl border-2 border-black flex items-center flex-col"
              >
                <div className="w-14 h-14 relative rounded-full object-cover mb-3">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${job.company_logo}`}
                    fill
                    alt="Company logo"
                  />
                </div>
                <Typography variant="h6" className="font-bold">
                  {job.title}
                </Typography>
                <Typography>{job.company_name}</Typography>
                <div className="flex mt-1 gap-2">
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
                  <Feature
                    icon={<Clock size={14} />}
                    title={job.employment_type}
                  />
                </div>
              </div>
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
