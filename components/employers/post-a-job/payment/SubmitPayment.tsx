import { usePayPalHostedFields } from "@paypal/react-paypal-js";
import clsx from "clsx";
import { Alert, Button, Loader, Typography } from "components/common";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { parseErrorMessage } from "utils/api";
import usePaymentStore from "./store/usePaymentStore";
import { setCookie } from "cookies-next";
import useAuthStore from "store/useAuthStore";

export interface TSubmitPaymentRef {
  setLoading: (val: boolean) => void;
  showSuccessAlert: (msg: string) => void;
  showErrorAlert: (msg: string) => void;
}

interface ISubmitPaymentProps {
  onClick: (order_id: string, package_id: number) => void;
  validateAccountForm?: () => Promise<unknown> | undefined;
  registerEmployers: () => Promise<{
    access_token: string;
    refresh_token: string;
  }>;
}

const SubmitPayment = forwardRef<TSubmitPaymentRef, ISubmitPaymentProps>(
  (props, ref) => {
    const { onClick, validateAccountForm, registerEmployers } = props;
    const { cardFields } = usePayPalHostedFields();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
      msg: string;
      show: boolean;
      type: "success" | "error" | undefined;
    }>({
      msg: "",
      show: false,
      type: "success",
    });
    const { packageItem } = usePaymentStore();
    const { accessToken, setAuth } = useAuthStore();

    useImperativeHandle(ref, () => ({
      setLoading: (val) => {
        setLoading(val);
      },
      showErrorAlert: (msg) => {
        setAlert({
          msg: msg,
          show: true,
          type: "error",
        });
        setTimeout(() => {
          setAlert({
            ...alert,
            show: false,
          });
        }, 3000);
      },
      showSuccessAlert: (msg) => {
        setAlert({
          msg: msg,
          show: true,
          type: "success",
        });
        setTimeout(() => {
          setAlert({
            ...alert,
            show: false,
          });
        }, 3000);
      },
    }));

    const { user } = useAuthStore();

    const availableVoucher = useMemo(() => {
      if (!user) return [];

      return user.available_vouchers.map((av) => av.package_id);
    }, [user]);

    const handleClick = async () => {
      if (!availableVoucher.includes(packageItem?.id || 0)) return;
      try {
        let orderId = "";
        // if (!cardFields) {
        //   throw new Error("Something went wrong");
        // }
        if (!packageItem) return;

        if (!accessToken && validateAccountForm) {
          try {
            await validateAccountForm();
            const { access_token, refresh_token } = await registerEmployers();
            setCookie("accessToken", access_token);
            setCookie("refreshToken", refresh_token);
            setAuth({
              accessToken: access_token,
              refreshToken: refresh_token,
            });
          } catch (error: any) {
            const keys = Object.keys(error);
            if (keys.includes("email") || keys.includes("password")) {
              throw new Error("Please fill account form");
            }
            throw new Error(parseErrorMessage(error));
          }
        }
        const packageId = packageItem!.id;

        // if (!availableVoucher.includes(packageId)) {
        //   setLoading(true);
        //   const { fields } = cardFields?.getState() || {};

        //   const isFormInvalid = Object.values(fields!).some(
        //     (field) => !field.isValid
        //   );
        //   if (isFormInvalid) {
        //     throw new Error("Credit card is invalid");
        //   }
        //   const order = await cardFields?.submit();
        //   orderId = order!.orderId;
        // }

        onClick(orderId, packageItem!.id);
      } catch (error) {
        setAlert({
          msg: parseErrorMessage(error),
          show: true,
          type: "error",
        });
        setTimeout(() => {
          setAlert({
            ...alert,
            show: false,
          });
        }, 3000);
        setLoading(false);
      }
    };
    return (
      <>
        <Alert
          className={clsx(
            "inset-0",
            [!alert.show && "h-0"],
            [alert.show && "h-9"]
          )}
          msg={alert.msg}
          show={alert.show}
          type={alert.type}
        />
        {loading ? (
          <div className="fixed inset-0 w-full h-full flex justify-center items-center z-50 bg-black/30">
            <Loader color="black" />
          </div>
        ) : null}
        <div
          className="p-6 flex flex-col gap-3 rounded-xl"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <Typography variant="h5" className="font-bold">
            Payment Summary
          </Typography>
          <div className="flex justify-between border-b border-black">
            <Typography>1x Job Post</Typography>
            <Typography className="font-bold">
              ${packageItem?.price || 0}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography>Subtotal:</Typography>
            <Typography className="font-bold">
              ${packageItem?.price || 0}
            </Typography>
          </div>
          <div className="flex justify-between border-b border-black">
            <Typography>Discount:</Typography>
            <Typography className="font-bold">$0</Typography>
          </div>
          <Typography className="text-right font-bold">
            Total: ${packageItem?.price || 0}
          </Typography>

          <div className="flex justify-end">
            <Button
              disabled={
                !packageItem ||
                loading ||
                !availableVoucher.includes(packageItem.id)
              }
              onClick={handleClick}
              block
              variant="white"
              className="border border-neutral-300"
            >
              Place your order
            </Button>
          </div>
        </div>
      </>
    );
  }
);

SubmitPayment.displayName = "SubmitPayment";

export default SubmitPayment;
