import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Typography } from "components/common";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Job } from "service/types";
import { Package } from "service/types/master_data_type";
import { AuthService } from "service/auth_service";
import AccountFormSection, {
  TAccountFormSectionRef,
} from "./payment/AccountFormSection";
import useJobStore from "./store/useJobStore";
import PaypalPaymentForm from "./payment/PaypalPaymentForm";
import { TPaypalPaymmentButtonOnClick } from "./payment/PaypalPaymentButton";
import PackageList from "./PackageList";
import { TSubmitPaymentRef } from "./payment/SubmitPayment";

interface PaymentPageProps {
  packages: Package[];
  clientToken: string;
  onSubmit: (val: Partial<Job>) => void;
}

const PaymentPage = forwardRef<TSubmitPaymentRef, PaymentPageProps>(
  (props, ref) => {
    const { packages, onSubmit, clientToken } = props;

    const submitPaymentRef = useRef<TSubmitPaymentRef>(null);
    const accountFormSectionRef = useRef<TAccountFormSectionRef>(null);

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
    } = useJobStore();

    const validateAccountForm = React.useCallback(() => {
      if (!accountFormSectionRef.current) return undefined;
      return accountFormSectionRef.current?.handleSubmit();
    }, []);

    const registerEmployers = React.useCallback(async () => {
      const values = accountFormSectionRef.current?.getFormData()!;
      const response = await AuthService.signUpEmployers({
        ...values,
        name: company_name!,
      });
      const { access_token, refresh_token } = response.data;
      return {
        access_token,
        refresh_token,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPaypalPaymentButtonClick = async (
      actions: TPaypalPaymmentButtonOnClick
    ) => {
      await accountFormSectionRef.current?.handleSubmit();
    };

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

    const handlePaymentClick = async (
      order_id: string = "",
      packageId: number
    ) => {
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
      const company = {
        company_name,
        company_headquarter,
        company_url,
        company_about,
        company_email,
        company_offer,
        company_logo,
      };
      onSubmit({ ...job, ...company, order_id });
    };
    return (
      <>
        <PayPalScriptProvider
          options={{
            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            "data-client-token": clientToken,
            components: "hosted-fields,buttons",
            intent: "capture",
          }}
        >
          <div className="grid grid-cols-1 gap-6 mt-4">
            <div className="flex flex-col gap-4">
              <div>
                <Typography
                  variant="h3"
                  className="font-bold font-palo uppercase"
                >
                  Gain more visibility!
                </Typography>
              </div>
              <PackageList packages={packages} />
            </div>
            <Typography className="text-center font-bold">
              Want to post more than 10+ jobs?{" "}
              <a href="mailto:youremail@test.com">Contact us</a> for customised
              packages!
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
        </PayPalScriptProvider>
      </>
    );
  }
);

PaymentPage.displayName = "PaymentPage";

export default PaymentPage;
