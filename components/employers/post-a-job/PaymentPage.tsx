import {
  PayPalHostedFieldsProvider,
  PayPalScriptProvider,
  destroySDKScript,
  getScriptID,
} from "@paypal/react-paypal-js";
import { Button, Typography } from "components/common";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Job, Package } from "service/types";
import { AuthService } from "service/auth_service";
import AccountFormSection, {
  TAccountFormSectionRef,
} from "./payment/AccountFormSection";
import useJobStore from "./store/useJobStore";
import PaypalPaymentForm from "./payment/PaypalPaymentForm";
import { TPaypalPaymmentButtonOnClick } from "./payment/PaypalPaymentButton";
import SubmitPayment, { TSubmitPaymentRef } from "./payment/SubmitPayment";
import PackageList from "./PackageList";
import { getCookie } from "cookies-next";
import PaymentService from "service/payment_service";

interface PaymentPageProps {
  clientToken: string;
  onSubmit: (val: Partial<Job>) => void;
  packages: Package[];
  onBack?: () => void;
}

const PaymentPage = forwardRef<TSubmitPaymentRef, PaymentPageProps>(
  (props, ref) => {
    const { onSubmit, clientToken, packages, onBack } = props;

    const submitPaymentRef = useRef<TSubmitPaymentRef>(null);
    const accountFormSectionRef = useRef<TAccountFormSectionRef>(null);

    const divRef = useRef(null);

    useEffect(() => {
      return () => {
        destroySDKScript(
          getScriptID({
            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          })
        );
      };
    }, []);
    const {
      title,
      apply_link,
      category_id,
      skill,
      is_worldwide,
      salary,
      description,
      company_name,
      company_headquarter,
      company_url,
      company_email,
      company_offer,
      company_about,
      employment_type_id,
      location_id,
      company_logo,
      company_size_id,
      job_industry_id,
    } = useJobStore();

    const validateAccountForm = React.useCallback(() => {
      if (!accountFormSectionRef.current) return undefined;
      return accountFormSectionRef.current?.handleSubmit();
    }, []);

    const registerEmployers = React.useCallback(async () => {
      submitPaymentRef.current!.setLoading(true);
      const values = accountFormSectionRef.current?.getFormData()!;
      const response = await AuthService.signUpEmployers({
        ...values,
        name: company_name!,
      });
      const { access_token, refresh_token } = response.data;
      submitPaymentRef.current!.setLoading(false);
      return {
        access_token,
        refresh_token,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPaypalPaymentButtonClick = React.useCallback(
      async (actions: TPaypalPaymmentButtonOnClick) => {
        await accountFormSectionRef.current?.handleSubmit();
      },
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        setLoading: (val) => {
          submitPaymentRef.current?.setLoading(val);
        },
        showErrorAlert: (msg) => {
          submitPaymentRef.current?.showErrorAlert(msg);
        },
        showSuccessAlert: (msg) => {
          submitPaymentRef.current?.showSuccessAlert(msg);
        },
      }),
      [submitPaymentRef]
    );

    const handlePaymentClick = React.useCallback(
      async (order_id: string = "", packageId: number) => {
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
          package_id: packageId,
        };
        if (!is_worldwide) {
          job.location_id = location_id;
        }
        if (job_industry_id) {
          job.job_industry_id = job_industry_id;
        }
        const company: any = {
          company_name,
          company_headquarter,
          company_url,
          company_about,
          company_email,
          company_offer,
          company_logo,
        };
        if (company_size_id) {
          company.company_size_id = company_size_id;
        }
        onSubmit({ ...job, ...company, order_id });
      },
      [
        apply_link,
        category_id,
        company_about,
        company_email,
        company_headquarter,
        company_logo,
        company_name,
        company_offer,
        company_url,
        description,
        employment_type_id,
        is_worldwide,
        location_id,
        onSubmit,
        salary,
        skill,
        title,
        company_size_id,
        job_industry_id,
      ]
    );
    return (
      <>
        <PayPalScriptProvider
          options={{
            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            "data-client-token": clientToken,
            components: "hosted-fields,buttons",
            intent: "capture",
            vault: false,
          }}
        >
          <PayPalHostedFieldsProvider
            createOrder={async () => {
              const packageItem = JSON.parse(
                getCookie("packageItem")!.toString()
              );
              const { data } = await PaymentService.createOrder(
                packageItem!.id
              );

              return data.id;
            }}
            styles={{
              input: {
                "font-family": "Poppins, sans-serif",
                "font-size": "16px",
              },
            }}
          >
            <div className="grid grid-cols-1 gap-6 mt-4">
              <div className="flex flex-col gap-4">
                <Typography variant="h4" className="font-bold mb-4">
                  Gain more visibility
                </Typography>
                <PackageList packages={packages} />
              </div>
              <Typography className="font-bold" variant="h4">
                Want to post more than 10+ jobs?{" "}
                <a href="mailto:youremail@test.com">Contact us</a> for
                customised packages!
              </Typography>

              <PaypalPaymentForm
                ref={submitPaymentRef}
                onApprove={handlePaymentClick}
                registerEmployers={registerEmployers}
                validateHostedField={validateAccountForm}
                validatePaypalButton={onPaypalPaymentButtonClick}
              />
            </div>
            <AccountFormSection ref={accountFormSectionRef} />
            <div className="mt-4">
              <SubmitPayment
                registerEmployers={registerEmployers}
                ref={submitPaymentRef}
                onClick={handlePaymentClick}
                validateAccountForm={validateAccountForm}
              />
            </div>
          </PayPalHostedFieldsProvider>
        </PayPalScriptProvider>

        <div className="mt-4">
          <Button onClick={onBack}>Back</Button>
        </div>
      </>
    );
  }
);

PaymentPage.displayName = "PaymentPage";

export default PaymentPage;
