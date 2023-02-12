import clsx from "clsx";
import { Button, Typography } from "components/common";
import React, { useState } from "react";
import { Package } from "service/types/master_data_type";
import PackageCard from "./PackageCard";

interface SecondStepProps {
  packages: Package[];
}

function SecondStep(props: SecondStepProps) {
  const { packages } = props;
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  return (
    <>
      `
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
        <div className="flex flex-col gap-4">
          <div>
            <Typography variant="h4" className="font-bold">
              Gain more visibility!
            </Typography>
            <Typography className="italic">
              Increase traffic to your listing by adding a logo, pinning it to
              the top or adding a highlight.
            </Typography>
          </div>
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
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-bold lg:mb-[3.25rem]">
            Confirmation & Pay
          </Typography>

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
            <Button variant="white">Make Payment</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SecondStep;
