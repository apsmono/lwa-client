import clsx from "clsx";
import { Typography } from "components/common";
import React, { ReactNode } from "react";

interface FeatureProps {
  icon?: ReactNode;
  title: string;
  className?: string;
}

function Feature({ icon, title, className }: FeatureProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 bg-white px-3 py-1 rounded-full bg-opacity-60",
        className
      )}
    >
      {icon}
      <Typography variant="small" className="font-medium">
        {title}
      </Typography>
    </div>
  );
}

export default Feature;
