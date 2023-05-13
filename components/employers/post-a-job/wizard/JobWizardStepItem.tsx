import clsx from "clsx";
import { Typography } from "components/common";
import React from "react";

interface IJobWizardStepItemProps {
  step: number;
  active?: boolean;
  title: string;
}
function JobWizardStepItem(props: IJobWizardStepItemProps) {
  const { step, active, title } = props;
  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className={clsx(
          "rounded-full w-10 h-10 bg-white border border-primary-500 flex justify-center items-center transition-all",
          { "bg-primary-500 text-white": active }
        )}
      >
        <Typography className="font-bold" variant="body">
          {step}
        </Typography>
      </div>
      <Typography className="mt-2 font-medium">{title}</Typography>
    </div>
  );
}

export default JobWizardStepItem;
