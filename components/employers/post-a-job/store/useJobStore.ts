import { removeCookies } from "cookies-next";
import { Job } from "service/types";
import { create } from "zustand";

interface JobState extends Partial<Job> {
  setJob: (val: Partial<Job>) => void;
  reset: () => void;
}
const initialState = {
  apply_link: "",
  category_id: 0,
  category_name: "",
  company_about: "",
  company_email: "",
  company_id: 0,
  company_logo: "",
  created_at: "",
  company_name: "",
  company_url: "",
  description: "",
  employment_type: "",
  company_headquarter: "",
  employment_type_id: 0,
  id: 0,
  is_featured: false,
  is_worldwide: true,
  location: "",
  package_id: 0,
  salary: "",
  skill: "",
  status: "",
  timezone: "",
  title: "",
  company_offer: "",
  location_id: 0,
  order_id: "",
  click_counts: 0,
  job_industry_id: undefined,
  industry_name: "",
  company_size: undefined,
  company_size_id: undefined,
};

const useJobStore = create<JobState>((set) => {
  return {
    ...initialState,
    setJob: (val: Partial<Job>) => {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
    reset: () => {
      removeCookies("job");
      set((state) => ({
        ...state,
        ...initialState,
      }));
    },
  };
});

export default useJobStore;
