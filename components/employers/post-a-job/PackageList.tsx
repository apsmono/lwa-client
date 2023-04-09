import React, { useEffect } from "react";
import { Package } from "service/types";
import { setCookie } from "cookies-next";
import useAuthStore from "store/useAuthStore";
import PackageCard from "./PackageCard";
import usePaymentStore from "./payment/store/usePaymentStore";
import useJobStore from "./store/useJobStore";

interface IPackageListProps {
  packages: Package[];
}

function PackageList(props: IPackageListProps) {
  const { packages } = props;
  const { setJobPayment, packageItem } = usePaymentStore();
  const { setJob } = useJobStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setCookie("packageItem", JSON.stringify(packageItem));
  }, [packageItem]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {packages.map((item, i) => (
        <PackageCard
          key={item.id}
          lastItem={i === packages.length - 1}
          item={item}
          onClick={(val) => {
            setJobPayment({ packageItem: val });
            setJob({ package_id: val?.id });
          }}
          isSelected={packageItem?.id === item.id}
          disabled={item.price === 0 && user?.is_free_post_used}
        />
      ))}
    </div>
  );
}

export default PackageList;
