import { Job } from "./job_type";

export type CompanySize = {
  id: number;
  size: string;
};

export type Company = {
  id: number;
  company_headquarter: string;
  company_name: string;
  company_email: string;
  company_url: string;
  company_logo: string;
  company_about: string;
  company_offer?: string;
  company_size_id?: number;
  company_size?: string;
  jobs: Job[];
};
