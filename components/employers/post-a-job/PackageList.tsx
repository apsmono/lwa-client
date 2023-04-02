import { setCookie } from "cookies-next";
import React, { useEffect } from "react";
import { Package } from "service/types";
import PackageCard from "./PackageCard";
import usePaymentStore from "./payment/store/usePaymentStore";

interface IPackageListProps {
  packages: Package[];
}

function PackageList(props: IPackageListProps) {
  const { packages } = props;
  const { setJobPayment, packageItem } = usePaymentStore();

  useEffect(() => {
    if (packageItem) {
      setCookie("package_id", packageItem.id.toString());
      setCookie("package_price", packageItem.price.toString());
    }
  }, [packageItem]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {packages.map((item, i) => (
        <PackageCard
          key={item.id}
          lastItem={i === packages.length - 1}
          item={item}
          onClick={(val) => setJobPayment({ packageItem: val })}
          isSelected={packageItem?.id === item.id}
        />
      ))}
    </div>
  );
}

export default PackageList;
