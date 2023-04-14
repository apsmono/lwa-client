import clsx from "clsx";
import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useRef, useState } from "react";
import { AuthService } from "service/auth_service";
import EmploymentTypeService from "service/employment_type_service";
import LocationService from "service/location_service";
import PackageService from "service/package_service";
import {
  LocationType,
  EmploymentType,
  Package,
  User,
  Job,
} from "service/types";
import useJobStore from "components/employers/post-a-job/store/useJobStore";
import { CreateJobWizard } from "components/employers/post-a-job";
import JobService from "service/job_service";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import { useRouter } from "next/router";
import { TCreateJobWizardRef } from "components/employers/post-a-job/CreateJobWizard";
import PaymentService from "service/payment_service";
import { parseErrorMessage } from "utils/api";
import { getCookie, hasCookie, removeCookies, setCookie } from "cookies-next";
import usePaymentStore from "components/employers/post-a-job/payment/store/usePaymentStore";
import useAppStore from "store/useAppStore";

interface PostJobPageProps {
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  packages: Package[];
  user?: User;
  currentStep?: string;
  defaultValue?: Partial<Job>;
  clientToken: string;
}

function PostJobPage(props: PostJobPageProps) {
  const { categories } = useAppStore();
  const {
    currentStep,
    user,
    defaultValue: defaultValueProps = null,
    locations,
    packages,
    employmentTypes,
    clientToken,
  } = props;
  const [step, setStep] = useState(currentStep === "PAYMENT" ? 2 : 1);

  const router = useRouter();
  const { reset: resetPayment } = usePaymentStore();

  const {
    company_name,
    company_email,
    company_headquarter,
    company_about,
    company_url,
    company_offer,
    company_logo,
    reset,
  } = useJobStore();

  const [defaultValue] = useState((): Partial<Job> | undefined => {
    if (defaultValueProps) return defaultValueProps;

    const jobCookies = getCookie("job")
      ? JSON.parse(getCookie("job")!.toString())
      : null;

    if (jobCookies) {
      return {
        apply_link: jobCookies.apply_link,
        category_id: jobCookies.category_id,
        category_name: jobCookies.category_name,
        company_about: jobCookies.company_about,
        company_email: jobCookies.company_email,
        company_id: jobCookies.company_id,
        company_logo: jobCookies.company_logo,
        created_at: "",
        company_name: jobCookies.company_name,
        company_url: jobCookies.company_url,
        description: jobCookies.description,
        employment_type: jobCookies.employment_type,
        company_headquarter: jobCookies.company_headquarter,
        employment_type_id: jobCookies.employment_type_id,
        id: 0,
        is_featured: false,
        is_worldwide: jobCookies.is_worldwide,
        location: "",
        package_id: jobCookies.package_id,
        salary: jobCookies.salary,
        skill: jobCookies.skill,
        status: "",
        timezone: jobCookies.timezone,
        title: jobCookies.title,
        company_offer: jobCookies.company_offer,
        location_id: jobCookies.location_id,
        order_id: "",
        click_counts: 0,
      };
    }
    const { company } = user || {};
    if (!company) return undefined;
    return {
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
    };
  });

  const wrappedCreateItem = useWrapHandleInvalidToken((params: any) =>
    JobService.create(params)
  );

  const formWizardRef = useRef<TCreateJobWizardRef>(null);

  const handleSubmit = async (val: Partial<Job>) => {
    try {
      formWizardRef.current?.setLoading(true);
      const response = await wrappedCreateItem({ ...val });
      formWizardRef.current?.showSuccessAlert(response.message);
      reset();
      resetPayment();
      removeCookies("job");

      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error) {
      formWizardRef.current?.showErrorAlert(parseErrorMessage(error));
      formWizardRef.current?.setLoading(false);
    }
  };

  return (
    <GuestLayout title="Post a Job">
      <div className="max-w-6xl mx-auto flex flex-col gap-2 p-4">
        <div className="w-full rounded-full with-shadow border border-black">
          <span
            className={clsx("inline-block w-1/3 rounded-full", {
              "bg-secondary-500": step === 1,
            })}
          >
            &nbsp;
          </span>
          <span
            className={clsx("inline-block w-1/3 rounded-full", {
              "bg-secondary-500": step === 2,
            })}
          >
            &nbsp;
          </span>
          <span
            className={clsx("inline-block w-1/3 rounded-full", {
              "bg-secondary-500": step === 3,
            })}
          >
            &nbsp;
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <Typography variant="h5" className="font-palo font-bold uppercase">
            1. Create your listing
          </Typography>
          <Typography variant="h5" className="font-palo font-bold uppercase">
            2. Preview your post
          </Typography>
          <Typography variant="h5" className="font-palo font-bold uppercase">
            3. Confirm & pay
          </Typography>
        </div>
        <CreateJobWizard
          ref={formWizardRef}
          initialStep={step}
          onStepChange={(val) => setStep(val)}
          onSubmit={handleSubmit}
          locations={locations}
          packages={packages}
          categories={categories}
          defaultValue={defaultValue}
          employmentTypes={employmentTypes}
          clientToken={clientToken}
        />
      </div>
    </GuestLayout>
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
  ]);
  props.locations = res[0].data;
  props.employmentTypes = res[1].data;
  props.packages = res[2].data;

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

  if (hasCookie("accessToken", context)) {
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
  }

  return {
    props,
  };
};

export default PostJobPage;
