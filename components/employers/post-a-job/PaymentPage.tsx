import {
  PayPalScriptProvider,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
} from "@paypal/react-paypal-js";
import { InputLabel, TextField, Typography } from "components/common";
import Cookies from "js-cookie";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PaymentService from "service/payment_service";
import { Job } from "service/types";
import { Package } from "service/types/master_data_type";
import PackageList from "./PackageList";
import PaypalPaymentButton from "./payment/PaypalPaymentButton";
import SubmitPayment, { TSubmitPaymentRef } from "./payment/SubmitPayment";
import useJobStore from "./store/useJobStore";

interface PaymentPageProps {
  packages: Package[];
  clientToken: string;
  onSubmit: (val: Partial<Job>) => void;
}

const PaymentPage = forwardRef<TSubmitPaymentRef, PaymentPageProps>(
  (props, ref) => {
    const { packages, onSubmit, clientToken } = props;

    const submitPaymentRef = useRef<TSubmitPaymentRef>(null);

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
          <PayPalHostedFieldsProvider
            createOrder={async () => {
              const { data } = await PaymentService.createOrder(
                +(Cookies.get("package_id") || 0)
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
                <a href="mailto:youremail@test.com">Contact us</a> for
                customised packages!
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 p-4 rounded-lg border-black">
                  <PaypalPaymentButton onApprove={handlePaymentClick} />

                  <Typography
                    className="font-medium text-center my-2"
                    variant="h4"
                  >
                    OR
                  </Typography>
                  <Typography variant="small">
                    Safe money transfer using your bank account Visa, Maestro,
                    Discover American Express, etc.
                  </Typography>

                  <TextField label="Name on Card" placeholder="Type Here" />

                  <div className="mb-3">
                    <InputLabel htmlFor="card-number">Card Number</InputLabel>
                    <div className="relative">
                      <PayPalHostedField
                        id="card-number"
                        className="border-2 rounded-lg border-black px-4 h-11"
                        hostedFieldType="number"
                        options={{
                          selector: "#card-number",
                          placeholder: "4111 1111 1111 1111",
                        }}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <picture>
                          <img src="/cc-logo.png" alt="CC" />
                        </picture>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
                    <div className="mb-3">
                      <InputLabel htmlFor="expiration-date">
                        Expiry Date
                      </InputLabel>
                      <PayPalHostedField
                        id="expiration-date"
                        className="border-2 rounded-lg border-black px-4 h-11"
                        hostedFieldType="expirationDate"
                        options={{
                          selector: "#expiration-date",
                          placeholder: "MM/YYYY",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <InputLabel htmlFor="cvv">CVV</InputLabel>
                      <PayPalHostedField
                        id="cvv"
                        className="border-2 rounded-lg border-black px-4 h-11"
                        hostedFieldType="cvv"
                        options={{
                          selector: "#cvv",
                          placeholder: "123",
                          maskInput: true,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
                    <div className="mb-3">
                      <TextField label="Country" />
                    </div>
                    <div className="mb-3">
                      <InputLabel htmlFor="expiration-date">
                        Postcode
                      </InputLabel>
                      <PayPalHostedField
                        id="postal-code"
                        className="border-2 rounded-lg border-black px-4 h-11"
                        hostedFieldType="postalCode"
                        options={{
                          selector: "#postal-code",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <SubmitPayment
                    ref={submitPaymentRef}
                    onClick={handlePaymentClick}
                  />
                </div>
              </div>
            </div>
          </PayPalHostedFieldsProvider>
        </PayPalScriptProvider>
      </>
    );
  }
);

PaymentPage.displayName = "PaymentPage";

export default PaymentPage;
