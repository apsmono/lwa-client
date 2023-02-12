import { Job } from "./job_type";

export type Company = {
  id: number;
  company_headquarter: string;
  company_name: string;
  company_email: string;
  company_url: string;
  company_logo: string;
  company_about: string;
  company_offer?: string;
  jobs: Job[];
};
