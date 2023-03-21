import { Package } from "service/types";
import { create } from "zustand";

interface JobPaymentState {
  packageItem?: Package;
}

interface IJobPaymentStore extends JobPaymentState {
  setJobPayment: (val: Partial<JobPaymentState>) => void;
}

const usePaymentStore = create<IJobPaymentStore>((set) => {
  return {
    packageItem: undefined,
    setJobPayment: (val) => {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
  };
});

export default usePaymentStore;
