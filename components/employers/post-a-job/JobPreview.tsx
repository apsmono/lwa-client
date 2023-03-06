import { Button } from "components/common";
import JobDisplay from "components/jobs/JobDisplay";
import React from "react";
import useJobStore from "./store/useJobStore";

interface IJobPreviewProps {
  onSubmit?: () => void;
}

function JobPreview(props: IJobPreviewProps) {
  const { onSubmit } = props;
  const {
    company_name,
    company_about,
    company_email,
    company_offer,
    company_logo,
    category_name,
    title,
    salary,
    apply_link,
    employment_type,
    is_worldwide,
    location,
    description,
  } = useJobStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-black with-shadow py-6 px-12 rounded-xl">
        <JobDisplay
          job={{
            company_offer,
            company_about,
            company_email,
            company_name,
            category_name,
            title,
            salary,
            apply_link,
            description,
            employment_type,
            location,
            is_worldwide,
            company_logo,
          }}
          showLearnMore={false}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={onSubmit} variant="black">
          Confirm & Pay
        </Button>
      </div>
    </div>
  );
}

export default JobPreview;
