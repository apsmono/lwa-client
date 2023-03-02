import { Company } from "./company_type";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  company?: Company;
  job_token_temp?: string;
};
