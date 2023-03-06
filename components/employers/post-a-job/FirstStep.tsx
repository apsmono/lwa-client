import { Button, Typography } from "components/common";
import { AppContext } from "context/appContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useRef } from "react";
import CompanyService from "service/company_service";
import {
  Category,
  EmploymentType,
  LanguageType,
  LocationType,
} from "service/types";
import useAuthStore from "store/useAuthStore";
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
    title,
    salary,
    apply_link,
    is_worldwide,
    description,
    setJob,
    order_id,
    category_id,
    skill,
    employment_type_id,
    location_id,
  } = useJobStore();

  const jobFormRef = useRef<JobFormRef>(null);
  const companyFormRef = useRef<CompanyFormRef>(null);
  const { accessToken } = useAuthStore();
  const router = useRouter();

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
    if (!accessToken) {
      const job: any = {
        title,
        order_id,
        apply_link,
        category_id,
        skill,
        employment_type_id,
        is_worldwide,
        salary,
        description,
      };
      if (!is_worldwide) {
        job.location_id = location_id;
      }

      const company = {
        company_name,
        company_headquarter,
        company_url,
        company_about,
        company_email,
        company_offer,
        company_logo,
      };
      Cookies.set("job", JSON.stringify({ ...job, ...company }));
      showErrorAlert("Please sign in first");
      router.push("/auth/sign-in");
      return;
    }
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
      <div className="grid grid-cols-1 gap:6 lg:gap-12 mt-4">
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

          <div className="flex justify-end">
            <Button variant="black" onClick={handleContinueToPayment}>
              Next to preview
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FirstStep;
