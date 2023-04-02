import { PayPalHostedField } from "@paypal/react-paypal-js";
import { InputLabel, TextField, Typography } from "components/common";
import React from "react";
import PaypalPaymentButton from "./PaypalPaymentButton";

interface IPaypalPaymentFormProps {
  onApprove: (order_id: string, package_id: number) => void;
}

function PaypalPaymentForm(props: IPaypalPaymentFormProps) {
  const { onApprove } = props;

  return (
    <div className="border-2 p-4 rounded-lg border-black">
      <PaypalPaymentButton onApprove={onApprove} />
      <Typography className="font-medium text-center my-2" variant="h3">
        OR
      </Typography>
      <Typography variant="small">
        Safe money transfer using your bank account Visa, Maestro, Discover
        American Express, etc.
      </Typography>

      <TextField label="First Name" placeholder="Type Here" />
      <TextField label="Last Name" placeholder="Type Here" />
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
        <div className="mb-3">
          <InputLabel htmlFor="expiration-date">Expiration Date</InputLabel>
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
  );
}

export default PaypalPaymentForm;
