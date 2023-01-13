import { Typography } from "components/common";
import React, { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
}

function Feature({ icon, title }: FeatureProps) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <Typography variant="small">{title}</Typography>
    </div>
  );
}

export default Feature;
