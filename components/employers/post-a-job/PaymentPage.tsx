import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button, Typography } from "components/common";
import Cookies from "js-cookie";

import React, { useEffect, useState } from "react";
import { Job } from "service/types";
import { Package } from "service/types/master_data_type";
import PackageCard from "./PackageCard";
import useJobStore from "./store/useJobStore";

interface PaymentPageProps {
  packages: Package[];
  onSubmit: (val: Partial<Job>) => void;
}

function PaymentPage(props: PaymentPageProps) {
  const { packages, onSubmit } = props;
  const [selectedPackage, setSelectedPackage] = useState<Package>();

  useEffect(() => {
    if (selectedPackage) {
      Cookies.set("package_id", selectedPackage.id.toString());
    }
  }, [selectedPackage]);

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
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div className="flex flex-col gap-4">
          <div>
            <Typography variant="h3" className="font-bold font-palo uppercase">
              Gain more visibility!
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {packages.map((item, i) => (
              <PackageCard
                key={item.id}
                lastItem={i === packages.length - 1}
                item={item}
                onClick={(val) => setSelectedPackage(val)}
                isSelected={selectedPackage?.id === item.id}
              />
            ))}
          </div>
        </div>
        <Typography className="text-center font-bold">
          Want to post more than 10+ jobs?{" "}
          <a href="mailto:youremail@test.com">Contact us</a> for customised
          packages!
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PayPalScriptProvider
            options={{
              "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: parseFloat(
                          (selectedPackage?.price || 1).toString()
                        ).toString(),
                      },
                      custom_id: Cookies.get("package_id"),
                    },
                  ],
                });
              }}
              disabled={![1, 2].includes(selectedPackage?.id || 3)}
              onApprove={async (data, action) => {
                const captured = await action.order?.capture();

                return new Promise(() => {
                  handlePaymentClick(
                    data.orderID,
                    +captured!.purchase_units[0]!.custom_id!
                  );
                });
              }}
            />
          </PayPalScriptProvider>
          <div className="border-2 border-black with-shadow bg-secondary-300 p-6 flex flex-col gap-3 rounded-xl">
            <Typography variant="h5" className="font-bold">
              Payment Summary
            </Typography>
            <div className="flex justify-between border-b border-black">
              <Typography>1x Job Post</Typography>
              <Typography className="font-bold">
                ${selectedPackage?.price || 0}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography>Subtotal:</Typography>
              <Typography className="font-bold">
                ${selectedPackage?.price || 0}
              </Typography>
            </div>
            <div className="flex justify-between border-b border-black">
              <Typography>Discount:</Typography>
              <Typography className="font-bold">$0</Typography>
            </div>
            <Typography className="text-right font-bold">
              Total: ${selectedPackage?.price || 0}
            </Typography>

            <div className="flex justify-end">
              <Button
                onClick={() => handlePaymentClick("", selectedPackage!.id)}
                disabled={!selectedPackage || selectedPackage.id !== 3}
                variant="secondary"
              >
                Place your order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
