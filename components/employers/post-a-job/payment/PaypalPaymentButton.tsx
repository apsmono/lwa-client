import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import usePaymentStore from "./store/usePaymentStore";
import { getCookie } from "cookies-next";

interface IPaypalPaymentButtonProps {
  onApprove: (order_id: string, package_id: number) => void;
}

function PaypalPaymentButton(props: IPaypalPaymentButtonProps) {
  const { onApprove } = props;
  const { packageItem } = usePaymentStore();
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: parseFloat(
                  (getCookie("package_price") || "").toString()
                ).toString(),
              },
              custom_id: (getCookie("package_id") || "").toString(),
            },
          ],
        });
      }}
      style={{ label: "pay" }}
      disabled={![1, 2].includes(packageItem?.id || 3)}
      onApprove={async (data, action) => {
        const captured = await action.order?.capture();

        return new Promise(() => {
          onApprove(data.orderID, +captured!.purchase_units[0]!.custom_id!);
        });
      }}
    />
  );
}

export default PaypalPaymentButton;
