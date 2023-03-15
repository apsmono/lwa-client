import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Category,
  EmploymentType,
  Job,
  LocationType,
  Package,
} from "service/types";
import JobFormPage from "./JobFormPage";
import JobPreview from "./JobPreview";
import PaymentPage from "./PaymentPage";
import useJobStore from "./store/useJobStore";

export type TCreateJobWizardRef = {
  setWizardStep: (step: number) => void;
};

interface ICreateJobWizardProps {
  initialStep?: number;
  onStepChange?: (step: number) => void;
  categories: Category[];
  employmentTypes: EmploymentType[];
  locations: LocationType[];
  packages: Package[];
  onSubmit: (val: Partial<Job>) => void;
  defaultValue?: Partial<Job>;
  onContinueToPayment?: (val: Partial<Job>) => void;
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
    } = props;

    const [step, setStep] = useState(initialStep);

    const { setJob, company_name } = useJobStore();

    useImperativeHandle(
      ref,
      () => ({
        setWizardStep: (num) => {
          setStep(num);
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
        {step === 1 && (
          <JobFormPage
            categories={categories}
            employmentTypes={employmentTypes}
            languages={[]}
            locations={locations}
            key={company_name}
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
        {step === 3 && <PaymentPage onSubmit={onSubmit} packages={packages} />}
      </>
    );
  }
);

CreateJobWizard.displayName = "CreateJobWizard";

export default CreateJobWizard;
