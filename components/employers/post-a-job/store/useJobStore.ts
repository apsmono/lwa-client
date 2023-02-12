import { Job } from "service/types";
import { create } from "zustand";

interface JobState extends Job {
  setJob: (val: Partial<Job>) => void;
  company_headquarter: string;
}

const useJobStore = create<JobState>((set) => ({
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
  id: 0,
  is_featured: false,
  is_worldwide: false,
  language: "",
  location: "",
  package_id: 0,
  salary: "",
  skill: "",
  status: "",
  timezone: "",
  title: "",
  company_offer: "",
  setJob: (val: Partial<Job>) => {
    set((state) => ({
      ...state,
      ...val,
    }));
  },
}));

export default useJobStore;
