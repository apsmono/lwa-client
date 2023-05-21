import React, { useEffect, useMemo } from "react";
import { setCookie } from "cookies-next";
import useAuthStore from "store/useAuthStore";
import { Package } from "service/types";
import PackageCard from "./package-card/PackageCard";
import usePaymentStore from "./payment/store/usePaymentStore";
import useJobStore from "./store/useJobStore";

interface IPackageListProps {
  packages: Package[];
}

function PackageList(props: IPackageListProps) {
  const { packages } = props;
  const { setJobPayment, packageItem } = usePaymentStore();

  useEffect(() => {
    setCookie("packageItem", JSON.stringify(packageItem));
  }, [packageItem]);

  const { setJob, package_id } = useJobStore();

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center max-w-3xl mx-auto">
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
