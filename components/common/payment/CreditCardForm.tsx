import {
  PayPalButtons,
  PayPalHostedField,
  PayPalHostedFieldsProvider,
  PayPalScriptProvider,
  usePayPalHostedFields,
} from "@paypal/react-paypal-js";
import { InputLabel, TextField } from "components/common/forms";
import React from "react";
import PaymentService from "service/payment_service";
import Button from "../Button";

interface ICreditCardFormProps {
  clientToken: string;
}

const SubmitPayment = () => {
  const { cardFields } = usePayPalHostedFields();
  const onPayClick = async () => {
    const { fields } = cardFields?.getState() || {};
    const isFormInvalid = Object.values(fields!).some(
      (field) => !field.isValid
    );
    if (typeof cardFields?.submit !== "function") alert("ERR");
    const order = await cardFields?.submit();
    console.log({ order });
  };
  return (
    <>
      <Button onClick={onPayClick} block>
        Pay
      </Button>
    </>
  );
};

function CreditCardForm(props: ICreditCardFormProps) {
  const { clientToken } = props;

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        "data-client-token": clientToken,
        components: "hosted-fields,buttons",
        intent: "capture",
        vault: false,
      }}
    >
      {/* <PayPalButtons /> */}

      <PayPalHostedFieldsProvider
        createOrder={async () => {
          const { data } = await PaymentService.createOrder(3);

          return data.id;
        }}
        notEligibleError="test"
        styles={{
          input: { "font-family": "Poppins, sans-serif", "font-size": "16px" },
        }}
      >
        <TextField label="First Name" placeholder="Type Here" />
        <TextField label="Last Name" placeholder="Type Here" />
        <div className="mb-3">
          <InputLabel htmlFor="card-number">Card Number</InputLabel>
          <PayPalHostedField
            id="card-number"
            className="border-2 rounded-lg border-black px-4 h-11"
            hostedFieldType="number"
            options={{
              selector: "#card-number",
              placeholder: "4111 1111 1111 1111",
            }}
          />
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
        <SubmitPayment />
      </PayPalHostedFieldsProvider>
    </PayPalScriptProvider>
  );
}

export default CreditCardForm;
