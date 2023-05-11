import { Button, Typography } from "components/common";
import { AppContext } from "context/appContext";
import React, { HTMLAttributes, useContext, useMemo, useRef } from "react";
import CompanyService from "service/company_service";
import {
  Category,
  EmploymentType,
  Job,
  JobIndustry,
  JobSalary,
  LanguageType,
  LocationType,
  Package,
} from "service/types";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import { CompanySize } from "service/types/company_type";
import { CompanyForm } from "../company";
import { CompanyFormRef } from "../company/CompanyForm";
import { JobForm } from "../job";
import { JobFormRef } from "../job/JobForm";
import useJobStore from "./store/useJobStore";
import PackageList from "./PackageList";
import clsx from "clsx";

export interface IPageTitle extends HTMLAttributes<HTMLParagraphElement> {}

interface JobFormPageProps {
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  languages: LanguageType[];
  categories: Category[];
  onSubmit?: (val: Partial<Job>) => void;
  jobIndustries: JobIndustry[];
  companySizes: CompanySize[];
  packages: Package[];
  salaries: JobSalary[];
  titleProps?: IPageTitle;
}

function JobFormPage(props: JobFormPageProps) {
  const {
    categories,
    employmentTypes,
    languages,
    locations,
    onSubmit = (val) => {},
    jobIndustries,
    companySizes,
    packages,
    salaries,
    titleProps,
  } = props;

  const industries = useMemo(() => {
    const copy = [...jobIndustries];
    const other = copy.filter((c) => c.name === "Other")[0];
    const copyWithoutOther = copy.filter((c) => c.name !== "Other");
    if (other) copyWithoutOther.push(other);
    return copyWithoutOther;
  }, [jobIndustries]);

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
    category_id,
    skill,
    employment_type_id,
    job_industry_id,
    location_id,
    company_size_id,
    package_id,
  } = useJobStore();

  const jobFormRef = useRef<JobFormRef>(null);
  const companyFormRef = useRef<CompanyFormRef>(null);

  const { showErrorAlert } = useAlert();
  const { setLoading } = useContext(AppContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleContinueToPayment = async () => {
    if (!package_id) {
      showErrorAlert("Please choose one package");
      containerRef.current!.scrollTop = 0;
      return;
    }
    await Promise.all([
      jobFormRef.current?.submitForm(),
      companyFormRef.current?.submitForm(),
    ]);

    const { company } = companyFormRef.current!.getValues();
    const { company_logo, ...otherItems } = company;
    const val = {
      ...jobFormRef.current!.getValues(),
      ...otherItems,
    };
    setJob(val);
    onSubmit(val);
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        ref={containerRef}
        className="grid grid-cols-1 gap:6 lg:gap-12 mt-4 mb-48 mx-auto"
      >
        <div className="flex flex-col gap-4">
          <p className={clsx("font-bold mb-4", titleProps?.className)}>
            Gain More Visibility
          </p>
          <PackageList packages={packages} />
        </div>
        <div className="flex flex-col gap-4">
          <p className={clsx("font-bold mt-8", titleProps?.className)}>
            Tell us About Your Job
          </p>
          <JobForm
            locations={locations}
            employmentTypes={employmentTypes}
            languages={languages}
            categories={categories}
            ref={jobFormRef}
            showSubmit={false}
            salaries={salaries}
            jobIndustries={industries}
            defaultValue={{
              apply_link,
              category_id,
              is_worldwide,
              location_id,
              skill,
              salary,
              title,
              employment_type_id,
              description,
              job_industry_id,
            }}
          />

          <Typography variant="h4" className="font-bold mt-8">
            Tell us About Your Company
          </Typography>
          <CompanyForm
            ref={companyFormRef}
            key={company_id}
            companySizes={companySizes}
            defaultValue={{
              company_name,
              company_headquarter,
              company_email,
              company_offer,
              company_about,
              company_url,
              company_logo,
              company_size_id,
            }}
            onLogoDrop={handleCompanyLogoDrop}
          />

          <div className="flex justify-end">
            <Button onClick={handleContinueToPayment}>Preview</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobFormPage;
