import { DropzoneValue } from "components/common/forms/Dropzone";
import { Job } from "service/types";
import { create } from "zustand";

interface JobState extends Job {
  setJob: (val: Partial<Job>) => void;
  setCompanyLogoFile: (val: DropzoneValue) => void;
  company_headquarter: string;
  companyLogoFile: DropzoneValue;
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
  employment_type_id: 0,
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
  companyLogoFile: {
    file: undefined,
    preview: undefined,
  },
  setCompanyLogoFile: (val: DropzoneValue) => {
    set((state) => ({
      ...state,
      companyLogoFile: val,
    }));
  },
}));

export default useJobStore;
