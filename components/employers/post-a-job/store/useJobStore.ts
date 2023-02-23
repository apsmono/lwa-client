import Cookies from "js-cookie";
import { Job } from "service/types";
import { create } from "zustand";

interface JobState extends Job {
  setJob: (val: Partial<Job>) => void;
  location_id: number;
  language_id: number;
}

const useJobStore = create<JobState>((set) => {
  const defaultValue = Cookies.get("job")
    ? JSON.parse(Cookies.get("job")!)
    : {};
  return {
    apply_link: defaultValue.apply_link,
    category_id: defaultValue.category_id,
    category_name: defaultValue.category_name,
    company_about: defaultValue.company_about,
    company_email: defaultValue.company_email,
    company_id: defaultValue.company_id,
    company_logo: defaultValue.company_logo,
    created_at: "",
    company_name: defaultValue.company_name,
    company_url: defaultValue.company_url,
    description: defaultValue.description,
    employment_type: defaultValue.employment,
    company_headquarter: defaultValue.company_headquarter,
    employment_type_id: defaultValue.employment_type_id,
    id: 0,
    is_featured: false,
    is_worldwide: defaultValue.is_worldwide,
    language: "",
    location: "",
    package_id: defaultValue.package_id,
    salary: defaultValue.salary,
    skill: defaultValue.skill,
    status: "",
    timezone: defaultValue.timezone,
    title: defaultValue.title,
    company_offer: defaultValue.company_offer,
    location_id: defaultValue.location_id,
    language_id: defaultValue.language_id,
    setJob: (val: Partial<Job>) => {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
  };
});

export default useJobStore;
