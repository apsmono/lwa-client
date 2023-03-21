import { PayPalButtons } from "@paypal/react-paypal-js";
import Cookies from "js-cookie";
import React from "react";
import usePaymentStore from "./store/usePaymentStore";

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
                value: parseFloat(Cookies.get("package_price")!).toString(),
              },
              custom_id: Cookies.get("package_id"),
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
