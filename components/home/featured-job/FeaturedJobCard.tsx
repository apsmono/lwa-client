import clsx from "clsx";
import { Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Job } from "service/types";
import { currencyFormat, CURRENCY_FORMAT_DEFAULT_CONFIG } from "utils/number";
import Feature from "./Feature";

interface FeaturedJobCard {
  job: Job;
  onClick?: () => void;
}

function FeaturedJobCard(props: FeaturedJobCard) {
  const { job, onClick } = props;
  return (
    <div
      className={clsx(
        "w-72 py-4 bg-secondary-500 rounded-xl border-2 border-black flex items-center flex-col cursor-pointer mb-2 hover:with-shadow transition-all"
      )}
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
      <div className="flex mt-1 gap-2 px-4 flex-wrap justify-center">
        <Feature
          icon={<Typography variant="body">🌏</Typography>}
          title={job.is_worldwide ? "Worldwide" : job.location}
        />
        <Feature
          icon={<Typography variant="body">💰</Typography>}
          title={currencyFormat(job?.salary || 0, {
            ...CURRENCY_FORMAT_DEFAULT_CONFIG,
            notation: "compact",
          })}
        />
        <Feature
          icon={<Typography variant="body">🕛</Typography>}
          title={job.employment_type}
        />
      </div>
      <div className="px-4 rounded-full border border-black mt-4 bg-w bg-white">
        {job.category_name}
      </div>
    </div>
  );
}

export default FeaturedJobCard;
