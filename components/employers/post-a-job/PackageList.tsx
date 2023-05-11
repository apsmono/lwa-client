import React, { useEffect } from "react";
import { Package } from "service/types";
import PackageCard from "./package-card/PackageCard";
import usePaymentStore from "./payment/store/usePaymentStore";
import useJobStore from "./store/useJobStore";

interface IPackageListProps {
  packages: Package[];
}

function PackageList(props: IPackageListProps) {
  const { packages } = props;
  const { setJobPayment } = usePaymentStore();

  const { setJob, package_id } = useJobStore();

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      {packages.map((item, i) => (
        <PackageCard
          key={item.id}
          lastItem={i === packages.length - 1}
          item={item}
          onClick={(val) => {
            setJobPayment({ packageItem: val });
            setJob({ package_id: val?.id });
          }}
          isSelected={package_id === item.id}
        />
      ))}
    </div>
  );
}

export default PackageList;
