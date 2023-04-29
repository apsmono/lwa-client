import { PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import { getCookie, setCookie } from "cookies-next";
import useAuthStore from "store/useAuthStore";
import usePaymentStore from "./store/usePaymentStore";
import { parseErrorMessage } from "utils/api";

export type TPaypalPaymmentButtonOnClick = {
  resolve: () => Promise<void>;
  reject: () => Promise<void>;
};

interface IPaypalPaymentButtonProps {
  onApprove: (order_id: string, package_id: number) => void;
  onClick?: (action: TPaypalPaymmentButtonOnClick) => Promise<void>;
  registerEmployers: () => Promise<{
    access_token: string;
    refresh_token: string;
  }>;
  setLoading?: (val: boolean) => void;
  showErrorMsg?: (msg: string) => void;
}

function PaypalPaymentButton(props: IPaypalPaymentButtonProps) {
  const {
    onApprove,
    onClick,
    registerEmployers,
    setLoading = (val) => {},
    showErrorMsg = (val) => {},
  } = props;
  const { packageItem } = usePaymentStore();
  const { accessToken, setAuth } = useAuthStore();
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: JSON.parse(
                  getCookie("packageItem")!.toString()
                ).price.toString(),
              },
              custom_id: JSON.parse(
                getCookie("packageItem")!.toString()
              ).id.toString(),
            },
          ],
        });
      }}
      onClick={async (data, action) => {
        if (!onClick) return action.resolve();
        if (accessToken) return action.resolve();

        try {
          await onClick(action);
          setLoading(true);
          const { access_token, refresh_token } = await registerEmployers();
          setCookie("accessToken", access_token);
          setCookie("refreshToken", refresh_token);
          setAuth({
            accessToken: access_token,
            refreshToken: refresh_token,
          });
          setLoading(false);
          return action.resolve();
        } catch (error) {
          showErrorMsg(parseErrorMessage(error));
          setLoading(false);
          return action.reject();
        }
      }}
      style={{ label: "pay" }}
      disabled={![1, 2].includes(packageItem?.id || 3)}
      onApprove={async (data, action) => {
        const captured = await action.order?.capture();

        return new Promise(() => {
          onApprove(data.orderID, +captured!.purchase_units[0]!.custom_id!);
        });
      }}
      className="text-center"
    />
  );
}

export default PaypalPaymentButton;
