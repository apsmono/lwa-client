import { PageTitle } from "components/common/dashboard";
import { CreateJobWizard } from "components/employers/post-a-job";
import useJobStore from "components/employers/post-a-job/store/useJobStore";
import { EmployersLayout } from "components/layout";
import { ROUTE_EMPLOYERS_LISTING } from "config/routes";
import { AppContext } from "context/appContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import EmploymentTypeService from "service/employment_type_service";
import JobService from "service/job_service";
import LanguageService from "service/languages_service";
import LocationService from "service/location_service";
import PackageService from "service/package_service";
import {
  Category,
  EmploymentType,
  Job,
  LanguageType,
  LocationType,
  Package,
  User,
} from "service/types";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";

interface IPostJobPageProps {
  categories: Category[];
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  packages: Package[];
  user: User;
}

function PostJobPage(props: IPostJobPageProps) {
  const { categories, employmentTypes, locations, packages, user } = props;
  const [defaultValue] = useState((): Partial<Job> => {
    const { company } = user;
    return { ...company };
  });

  const router = useRouter();

  const { reset } = useJobStore();

  const wrappedCreateItem = useWrapHandleInvalidToken((params: any) =>
    JobService.create(params)
  );

  const { setLoading } = useContext(AppContext);
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const handleSubmit = async (val: Partial<Job>) => {
    try {
      setLoading(true);
      const response = await wrappedCreateItem(val);
      showSuccessAlert(response.message);
      setLoading(false);
      reset();
      router.replace(ROUTE_EMPLOYERS_LISTING);
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
      setLoading(false);
    }
  };
  return (
    <EmployersLayout
      title="Post a Job"
      categories={categories}
      employers={user}
    >
      <PageTitle>Post a Job</PageTitle>
      <CreateJobWizard
        onSubmit={handleSubmit}
        locations={locations}
        packages={packages}
        categories={categories}
        defaultValue={defaultValue}
        employmentTypes={employmentTypes}
      />
    </EmployersLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  const res = await Promise.all([
    CategoryService.gets(),
    LocationService.gets(),
    EmploymentTypeService.gets(),
    PackageService.gets(),
  ]);
  props.categories = res[0].data;
  props.locations = res[1].data;
  props.employmentTypes = res[2].data;
  props.packages = res[3].data;
  try {
    const user = (await AuthService.fetchMe(context)).data?.user || null;

    props.user = user;
  } catch (error) {
    props.user = null;
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
