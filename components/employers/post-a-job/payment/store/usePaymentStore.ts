import { getCookie, removeCookies } from "cookies-next";
import { Package } from "service/types";
import { create } from "zustand";

interface JobPaymentState {
  packageItem?: Package;
  reset: () => void;
}

interface IJobPaymentStore extends JobPaymentState {
  setJobPayment: (val: Partial<JobPaymentState>) => void;
}

const usePaymentStore = create<IJobPaymentStore>((set) => {
  const packageCookie = getCookie("packageItem");
  return {
    packageItem: packageCookie
      ? JSON.parse(packageCookie.toString())
      : undefined,
    setJobPayment: (val) => {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
    reset: () => {
      removeCookies("packageItem");
      set((state) => ({
        ...state,
        packageItem: undefined,
      }));
    },
  };
});

export default usePaymentStore;
