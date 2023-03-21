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
  LocationType,
  Package,
} from "service/types";
import JobFormPage from "./JobFormPage";
import JobPreview from "./JobPreview";
import { TSubmitPaymentRef } from "./payment/SubmitPayment";
import PaymentPage from "./PaymentPage";
import useJobStore from "./store/useJobStore";

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
        {step === 3 && (
          <PaymentPage
            clientToken={clientToken}
            onSubmit={onSubmit}
            packages={packages}
            ref={paymentPageRef}
          />
        )}
      </>
    );
  }
);

CreateJobWizard.displayName = "CreateJobWizard";

export default CreateJobWizard;
