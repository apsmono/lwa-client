import clsx from "clsx";
import { Typography } from "components/common";
import { FirstStep, SecondStep } from "components/employers/post-a-job";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import EmploymentTypeService from "service/employment_type_service";
import LanguageService from "service/languages_service";
import LocationService from "service/location_service";
import PackageService from "service/package_service";
import { handleInvalidTokenServerSide } from "utils/api";
import {
  Category,
  LocationType,
  EmploymentType,
  LanguageType,
  Package,
  User,
} from "service/types";
import useJobStore from "components/employers/post-a-job/store/useJobStore";

interface PostJobPageProps {
  categories: Category[];
  languages: LanguageType[];
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  packages: Package[];
  user: User;
}

function PostJobPage(props: PostJobPageProps) {
  const { categories, employmentTypes, languages, locations, packages, user } =
    props;
  const [step, setStep] = useState(1);

  const { setJob } = useJobStore();

  useEffect(() => {
    const { company } = user;
    if (!company) return;

    setJob({
      ...company,
      company_id: company.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GuestLayout title="Post a Job" categories={categories}>
      <div className="max-w-7xl mx-auto flex flex-col gap-2 p-4">
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
  const props: any = {};
  const res = await Promise.all([
    CategoryService.gets(),
    LanguageService.gets(),
    LocationService.gets(),
    EmploymentTypeService.gets(),
    PackageService.gets(),
    handleInvalidTokenServerSide(() => AuthService.fetchMe(context), context),
  ]);
  props.categories = res[0].data;
  props.languages = res[1].data;
  props.locations = res[2].data;
  props.employmentTypes = res[3].data;
  props.packages = res[4].data;
  props.user = res[5].data?.user;

  if (!props.user) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: true,
      },
    };
  }

  return {
    props,
  };
};

export default PostJobPage;
