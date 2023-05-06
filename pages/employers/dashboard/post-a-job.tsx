import { PageTitle } from "components/common/dashboard";
import { CreateJobWizard } from "components/employers/post-a-job";
import { TCreateJobWizardRef } from "components/employers/post-a-job/wizard/CreateJobWizard";
import usePaymentStore from "components/employers/post-a-job/payment/store/usePaymentStore";
import useJobStore from "components/employers/post-a-job/store/useJobStore";
import { EmployersLayout } from "components/layout";
import { ROUTE_POST_SUCCESS } from "config/routes";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { AuthService } from "service/auth_service";
import EmploymentTypeService from "service/employment_type_service";
import JobService from "service/job_service";
import LocationService from "service/location_service";
import PackageService from "service/package_service";
import PaymentService from "service/payment_service";
import {
  EmploymentType,
  Job,
  JobIndustry,
  LocationType,
  Package,
  User,
} from "service/types";
import useAppStore from "store/useAppStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import JobIndustryService from "service/job_industry_service";
import { CompanySize } from "service/types/company_type";
import CompanySizeService from "service/company_size_service";

interface IPostJobPageProps {
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  packages: Package[];
  jobIndustries: JobIndustry[];
  user: User;
  companySizes: CompanySize[];
  clientToken: string;
}

function PostJobPage(props: IPostJobPageProps) {
  const {
    employmentTypes,
    locations,
    clientToken,
    packages,
    user,
    jobIndustries = [],
    companySizes,
  } = props;
  const { categories } = useAppStore();
  const [defaultValue] = useState((): Partial<Job> => {
    const { company } = user;
    return { ...company };
  });

  const router = useRouter();
  const { reset: resetPayment } = usePaymentStore();

  const { reset } = useJobStore();

  const wrappedCreateItem = useWrapHandleInvalidToken((params: any) =>
    JobService.create(params)
  );
  const formWizardRef = useRef<TCreateJobWizardRef>(null);

  const { showErrorAlert } = useAlert();

  const handleSubmit = async (val: Partial<Job>) => {
    try {
      formWizardRef.current?.setLoading(true);
      const response = await wrappedCreateItem(val);
      formWizardRef.current?.showSuccessAlert(response.message);

      reset();
      resetPayment();
      setTimeout(() => {
        router.replace(ROUTE_POST_SUCCESS);
      }, 1000);
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
      formWizardRef.current?.setLoading(false);
    }
  };
  return (
    <EmployersLayout title="Post a Job" employers={user}>
      <PageTitle>Post a Job</PageTitle>
      <CreateJobWizard
        jobIndustries={jobIndustries}
        clientToken={clientToken}
        ref={formWizardRef}
        onSubmit={handleSubmit}
        locations={locations}
        packages={packages}
        categories={categories}
        defaultValue={defaultValue}
        employmentTypes={employmentTypes}
        companySizes={companySizes}
      />
    </EmployersLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  const res = await Promise.all([
    LocationService.gets(),
    EmploymentTypeService.gets(),
    PackageService.gets(),
    JobIndustryService.gets(),
    CompanySizeService.gets(),
  ]);
  props.locations = res[0].data;
  props.employmentTypes = res[1].data;
  props.packages = res[2].data;
  props.jobIndustries = res[3].data;
  props.companySizes = res[4].data;

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

  if (!hasCookie("paypalClientToken", context)) {
    const { data } = await PaymentService.getClientToken();
    props.clientToken = data.client_token;
    setCookie("paypalClientToken", props.clientToken, {
      ...context,
      maxAge: 3600,
    });
  } else {
    props.clientToken = getCookie("paypalClientToken", context);
  }
  return {
    props,
  };
};

export default PostJobPage;
