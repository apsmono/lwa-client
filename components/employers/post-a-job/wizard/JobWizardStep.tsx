import React from "react";
import { Typography } from "components/common";
import clsx from "clsx";
import JobWizardStepItem from "./JobWizardStepItem";

interface IJobWizardStepProps {
  activeStep: number;
}

function JobWizardStep(props: IJobWizardStepProps) {
  const { activeStep } = props;
  return (
    <div className="flex w-full justify-between relative">
      <div className="absolute left-0 w-full top-7 z-[-1] grid grid-cols-2">
        <div className="pl-12">
          <span
            className={clsx(
              "inline-block h-4 w-full transition-all",
              {
                "bg-primary-500": activeStep > 1,
              },
              { "bg-primary-100": activeStep <= 1 }
            )}
          />
        </div>
        <div className="pr-12">
          <span
            className={clsx(
              "inline-block h-4 w-full transition-all",
              {
                "bg-primary-500": activeStep > 2,
              },
              { "bg-primary-100": activeStep <= 2 }
            )}
          />
        </div>
      </div>
      <JobWizardStepItem
        active={activeStep >= 1}
        step={1}
        title="Create Your Listing"
      />
      <JobWizardStepItem
        active={activeStep >= 2}
        step={2}
        title="Preview Your Post"
      />
      <JobWizardStepItem
        active={activeStep === 3}
        step={3}
        title="Confirm & Pay"
      />
    </div>
  );
}

export default JobWizardStep;
