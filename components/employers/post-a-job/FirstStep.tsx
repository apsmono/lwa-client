import { Button, Typography } from "components/common";
import JobDisplay from "components/jobs/JobDisplay";
import { AppContext } from "context/appContext";
import React, { useContext, useRef } from "react";
import CompanyService from "service/company_service";
import {
  Category,
  EmploymentType,
  LanguageType,
  LocationType,
} from "service/types";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import { CompanyForm } from "../company";
import { CompanyFormRef } from "../company/CompanyForm";
import { JobForm } from "../job";
import { JobFormRef } from "../job/JobForm";
import useJobStore from "./store/useJobStore";

interface FirstStepProps {
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  languages: LanguageType[];
  categories: Category[];
  onSubmit: () => void;
}

function FirstStep(props: FirstStepProps) {
  const { categories, employmentTypes, languages, locations, onSubmit } = props;

  const {
    company_name,
    company_about,
    company_email,
    company_url,
    company_offer,
    company_id,
    company_headquarter,
    company_logo,
    category_name,
    title,
    salary,
    apply_link,
    employment_type,
    is_worldwide,
    location,
    description,
    setJob,
  } = useJobStore();

  const jobFormRef = useRef<JobFormRef>(null);
  const companyFormRef = useRef<CompanyFormRef>(null);

  const { showErrorAlert } = useAlert();
  const { setLoading } = useContext(AppContext);

  const handlePreviewClick = () => {
    const { company } = companyFormRef.current!.getValues();
    const { company_logo, ...otherItems } = company;
    const val = {
      ...jobFormRef.current!.getValues(),
      ...otherItems,
    };
    setJob(val);
  };

  const handleContinueToPayment = async () => {
    await Promise.all([
      jobFormRef.current?.submitForm(),
      companyFormRef.current?.submitForm(),
    ]);
    handlePreviewClick();
    onSubmit();
  };

  const handleCompanyLogoDrop = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("company_logo", file);
      const response = await CompanyService.uploadLogo(formData);

      const { filePath } = response.data;

      setJob({ company_logo: filePath });
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap:6 lg:gap-12 mt-4">
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold">
            Tell us about your Job
          </Typography>
          <JobForm
            locations={locations}
            employmentTypes={employmentTypes}
            languages={languages}
            categories={categories}
            ref={jobFormRef}
            className="p-6"
          />

          <Typography variant="h4" className="font-bold mt-8">
            Tell us about your Company
          </Typography>
          <CompanyForm
            ref={companyFormRef}
            key={company_id}
            defaultValue={{
              company_name,
              company_headquarter,
              company_email,
              company_offer,
              company_about,
              company_url,
              company_logo,
            }}
            onLogoDrop={handleCompanyLogoDrop}
            className="p-6"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold">
            Preview of your job post!
          </Typography>
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
          <div className="flex justify-between">
            <Button variant="black" onClick={handlePreviewClick}>
              Preview
            </Button>
            <Button variant="secondary" onClick={handleContinueToPayment}>
              Confirm & Pay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FirstStep;
