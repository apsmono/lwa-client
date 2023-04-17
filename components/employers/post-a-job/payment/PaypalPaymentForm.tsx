// @refresh reset

import {
  PayPalHostedField,
  PayPalHostedFieldsProvider,
} from "@paypal/react-paypal-js";
import { InputLabel, TextField, Typography } from "components/common";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PaymentService from "service/payment_service";
import { getCookie } from "cookies-next";
import SubmitPayment, { TSubmitPaymentRef } from "./SubmitPayment";
import PaypalPaymentButton, {
  TPaypalPaymmentButtonOnClick,
} from "./PaypalPaymentButton";

interface IPaypalPaymentFormProps {
  onApprove: (order_id: string, package_id: number) => void;
  validatePaypalButton?: (
    action: TPaypalPaymmentButtonOnClick
  ) => Promise<void>;
  registerEmployers: () => Promise<{
    access_token: string;
    refresh_token: string;
  }>;
  validateHostedField?: () => Promise<unknown> | undefined;
}

const PaypalPaymentForm = forwardRef<
  TSubmitPaymentRef,
  IPaypalPaymentFormProps
>((props, ref) => {
  const {
    onApprove,
    validatePaypalButton,
    registerEmployers,
    validateHostedField,
  } = props;
  const submitPaymentRef = useRef<TSubmitPaymentRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      setLoading: (val) => submitPaymentRef.current?.setLoading(val),
      showErrorAlert: (msg) => submitPaymentRef.current?.showErrorAlert(msg),
      showSuccessAlert: (msg) =>
        submitPaymentRef.current?.showSuccessAlert(msg),
    }),
    []
  );

  return (
    <PayPalHostedFieldsProvider
      createOrder={async () => {
        const packageItem = JSON.parse(getCookie("packageItem")!.toString());
        const { data } = await PaymentService.createOrder(packageItem!.id);

        return data.id;
      }}
      styles={{
        input: {
          "font-family": "Poppins, sans-serif",
          "font-size": "16px",
        },
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="border-2 p-4 rounded-lg border-black">
            <PaypalPaymentButton
              onApprove={onApprove}
              onClick={validatePaypalButton}
              registerEmployers={registerEmployers}
              setLoading={submitPaymentRef.current?.setLoading}
              showErrorMsg={submitPaymentRef.current?.showErrorAlert}
            />

            <Typography className="font-medium text-center my-2" variant="h4">
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
                    placeholder: "xxxx xxxx xxxx xxxx",
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
              <div className="mb-3">
                <InputLabel htmlFor="expiration-date">Expiry Date</InputLabel>
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
                <InputLabel htmlFor="expiration-date">Postcode</InputLabel>
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
        </div>
        <div>
          <SubmitPayment
            registerEmployers={registerEmployers}
            ref={submitPaymentRef}
            onClick={onApprove}
            validateAccountForm={validateHostedField}
          />
        </div>
      </div>
    </PayPalHostedFieldsProvider>
  );
});

PaypalPaymentForm.displayName = "PaypalPaymentForm";

export default PaypalPaymentForm;
