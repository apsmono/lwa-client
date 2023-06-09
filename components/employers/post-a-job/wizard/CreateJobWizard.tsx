import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Category,
  EmploymentType,
  Job,
  JobIndustry,
  JobSalary,
  LocationType,
  Package,
} from "service/types";
import JobFormPage, { IPageTitle } from "../JobFormPage";
import JobPreview from "../JobPreview";
import { TSubmitPaymentRef } from "../payment/SubmitPayment";
import PaymentPage from "../PaymentPage";
import useJobStore from "../store/useJobStore";
import JobWizardStep from "./JobWizardStep";
import { CompanySize } from "service/types/company_type";

export type TCreateJobWizardRef = {
  setWizardStep: (step: number) => void;
} & TSubmitPaymentRef;

interface ICreateJobWizardProps {
  clientToken: string;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  categories: Category[];
  employmentTypes: EmploymentType[];
  locations: LocationType[];
  packages: Package[];
  onSubmit: (val: Partial<Job>) => void;
  defaultValue?: Partial<Job>;
  onContinueToPayment?: (val: Partial<Job>) => void;
  showStep?: boolean;
  jobIndustries: JobIndustry[];
  companySizes: CompanySize[];
  jobSalaries: JobSalary[];
  titleProps?: IPageTitle;
}

const CreateJobWizard = forwardRef<TCreateJobWizardRef, ICreateJobWizardProps>(
  (props, ref) => {
    const {
      initialStep = 1,
      onStepChange,
      packages,
      categories,
      employmentTypes,
      locations,
      onSubmit,
      defaultValue,
      onContinueToPayment,
      clientToken,
      showStep,
      jobIndustries,
      companySizes,
      jobSalaries,
      titleProps,
    } = props;

    const [step, setStep] = useState(initialStep);
    const paymentPageRef = useRef<TSubmitPaymentRef>(null);

    const { setJob, company_name } = useJobStore();

    useImperativeHandle(
      ref,
      () => ({
        setWizardStep: (num) => {
          setStep(num);
        },
        setLoading: (val) => {
          paymentPageRef.current?.setLoading(val);
        },
        showErrorAlert: (msg) => {
          paymentPageRef.current?.showErrorAlert(msg);
        },
        showSuccessAlert: (msg) => {
          paymentPageRef.current?.showSuccessAlert(msg);
        },
      }),
      []
    );

    useEffect(() => {
      if (defaultValue) {
        setJob({ ...defaultValue });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (onStepChange) {
        onStepChange(step);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);
    return (
      <>
        {showStep ? (
          <>
            <JobWizardStep activeStep={step} key={step} />
          </>
        ) : null}
        {step === 1 && (
          <JobFormPage
            categories={categories}
            employmentTypes={employmentTypes}
            languages={[]}
            locations={locations}
            jobIndustries={jobIndustries}
            key={company_name}
            packages={packages}
            salaries={jobSalaries}
            companySizes={companySizes}
            titleProps={titleProps}
            onSubmit={(val) => {
              if (onContinueToPayment) {
                onContinueToPayment(val);
              } else {
                setStep(2);
              }
            }}
          />
        )}
        {step === 2 && (
          <JobPreview onSubmit={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 ? (
          <PaymentPage
            clientToken={clientToken}
            titleProps={titleProps}
            onSubmit={onSubmit}
            ref={paymentPageRef}
            onBack={() => setStep(2)}
            packages={packages}
          />
        ) : null}
      </>
    );
  }
);

CreateJobWizard.displayName = "CreateJobWizard";

export default CreateJobWizard;
