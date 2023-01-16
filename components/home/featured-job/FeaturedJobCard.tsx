import { Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Clock, MapPin } from "react-feather";
import { Job } from "service/types";
import Feature from "./Feature";

interface FeaturedJobCard {
  job: Job;
  onClick?: () => void;
}

function FeaturedJobCard(props: FeaturedJobCard) {
  const { job, onClick } = props;
  return (
    <div
      className="w-60 py-4 bg-secondary-500 rounded-xl border-2 border-black flex items-center flex-col cursor-pointer mb-2 with-shadow"
      onClick={onClick}
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
            <Image src="/dollar-circle.svg" alt="$" width={14} height={14} />
          }
          title={job.salary}
        />
        <Feature icon={<Clock size={14} />} title={job.employment_type} />
      </div>
    </div>
  );
}

export default FeaturedJobCard;
