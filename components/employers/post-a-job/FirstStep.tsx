import { Button, Typography } from "components/common";
import JobDisplay from "components/jobs/JobDisplay";
import React from "react";
import {
  Category,
  Company,
  EmploymentType,
  LanguageType,
  LocationType,
} from "service/types";
import { CompanyForm } from "../company";
import { JobForm } from "../job";

interface FirstStepProps {
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  languages: LanguageType[];
  categories: Category[];
  company?: Company;
  onSubmit: () => void;
}

function FirstStep(props: FirstStepProps) {
  const {
    categories,
    employmentTypes,
    languages,
    locations,
    onSubmit,
    company,
  } = props;

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold">
            Tell us about your Job
          </Typography>
          <JobForm
            locations={locations}
            employmentTypes={employmentTypes}
            languages={languages}
            categories={categories}
          />

          <Typography variant="h4" className="font-bold mt-8">
            Tell us about your Company
          </Typography>
          <CompanyForm />
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold">
            Preview of your job post!
          </Typography>
          <div className="border-2 border-black with-shadow p-6 rounded-xl">
            <JobDisplay />
          </div>
          <div className="flex justify-between">
            <Button variant="black">Preview</Button>
            <Button variant="secondary" onClick={onSubmit}>
              Confirm & Pay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FirstStep;
