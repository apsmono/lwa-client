import clsx from "clsx";
import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import EmploymentTypeService from "service/employment_type_service";
import LanguageService from "service/languages_service";
import LocationService from "service/location_service";
import PackageService from "service/package_service";
import {
  Category,
  LocationType,
  EmploymentType,
  LanguageType,
  Package,
  User,
  Job,
} from "service/types";
import useJobStore from "components/employers/post-a-job/store/useJobStore";
import { FirstStep, SecondStep } from "components/employers/post-a-job";
import JobService from "service/job_service";

interface PostJobPageProps {
  categories: Category[];
  languages: LanguageType[];
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  packages: Package[];
  user?: User;
  currentStep?: string;
  defaultValue?: Partial<Job>;
}

function PostJobPage(props: PostJobPageProps) {
  const {
    categories,
    employmentTypes,
    currentStep,
    languages,
    locations,
    packages,
    user,
    defaultValue = null,
  } = props;
  const [step, setStep] = useState(currentStep === "PAYMENT" ? 2 : 1);

  const {
    setJob,
    company_name,
    company_email,
    company_headquarter,
    company_about,
    company_url,
    company_offer,
    company_logo,
  } = useJobStore();

  useEffect(() => {
    if (defaultValue) {
      setJob({ ...defaultValue });
      return;
    }
    const { company } = user || {};
    if (!company) return;

    setJob({
      company_about: !company_about ? company.company_about : company_about,
      company_email: !company_email ? company.company_email : company_email,
      company_name: !company_name ? company.company_name : company_name,
      company_offer: !company_offer ? company.company_offer : company_offer,
      company_url: !company_url ? company.company_url : company_url,
      company_headquarter: !company_headquarter
        ? company.company_headquarter
        : company_headquarter,
      company_id: company.id,
      company_logo: !company_logo ? company.company_logo : company_logo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GuestLayout title="Post a Job" categories={categories}>
      <div className="max-w-6xl mx-auto flex flex-col gap-2 p-4">
        <div className="w-full rounded-full with-shadow border border-black">
          <span
            className={clsx("inline-block w-1/2 rounded-full", {
              "bg-secondary-500": step === 1,
            })}
          >
            &nbsp;
          </span>
          <span
            className={clsx("inline-block w-1/2 rounded-full", {
              "bg-secondary-500": step === 2,
            })}
          >
            &nbsp;
          </span>
        </div>
        <div className="flex justify-between">
          <Typography>1. Create your listing</Typography>
          <Typography>2. Confirm & pay</Typography>
        </div>
        {step === 1 && (
          <FirstStep
            categories={categories}
            employmentTypes={employmentTypes}
            languages={languages}
            locations={locations}
            onSubmit={() => setStep(2)}
          />
        )}
        {step === 2 && <SecondStep packages={packages} />}
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  const res = await Promise.all([
    CategoryService.gets(),
    LanguageService.gets(),
    LocationService.gets(),
    EmploymentTypeService.gets(),
    PackageService.gets(),
  ]);
  props.categories = res[0].data;
  props.languages = res[1].data;
  props.locations = res[2].data;
  props.employmentTypes = res[3].data;
  props.packages = res[4].data;
  try {
    const user = (await AuthService.fetchMe(context)).data?.user || null;

    props.user = user;

    if (user?.job_token_temp) {
      const { data } = await JobService.getJobTemp(user.job_token_temp);
      console.log({ job: data.job });
      props.defaultValue = data.job;
    }
  } catch (error) {
    props.user = null;
  }

  return {
    props,
  };
};

export default PostJobPage;
