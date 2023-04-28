import clsx from "clsx";
import { Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Job } from "service/types";
import { currencyFormat, CURRENCY_FORMAT_DEFAULT_CONFIG } from "utils/number";
import Feature from "./Feature";
import { dateFormat } from "utils/date";

interface FeaturedJobCard {
  job: Job;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

function FeaturedJobCard(props: FeaturedJobCard) {
  const { job, onClick, variant = "primary" } = props;
  return (
    <div
      className={clsx(
        "w-72 py-9 rounded-2xl flex flex-col gap-4 cursor-pointer mb-2 transition-all px-6",
        { "bg-primary-500": variant === "primary" },
        { "bg-secondary-500": variant === "secondary" }
      )}
      onClick={onClick}
    >
      <div className="w-14 h-14 relative rounded-full object-cover mb-3">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${job.company_logo}`}
          fill
          alt="Company logo"
          className="object-cover rounded-full"
        />
      </div>
      <div>
        <Typography variant="h4" className="font-bold mb-2">
          {job.title}
        </Typography>
        <Typography>{job.company_name}</Typography>
      </div>
      <div className="flex mt-1 gap-2 flex-wrap">
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
      <div>
        <span
          className={clsx("px-4 py-1 rounded-full mt-4 text-white", {
            "bg-primary-800": variant === "primary",
            "bg-secondary-700": variant === "secondary",
          })}
        >
          {job.category_name}
        </span>
      </div>
      <Typography>
        {dateFormat(job.created_at, { day: "2-digit", month: "short" })}
      </Typography>
    </div>
  );
}

export default FeaturedJobCard;
