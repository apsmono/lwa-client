import { Company } from "./company_type";
import { TJobVoucher } from "./job_type";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  company?: Company;
  job_token_temp?: string;
  created_at: string;
  email_verified_at: string;
  status: number;
  registration_token: string;
  is_free_post_used: boolean;
  available_vouchers: TJobVoucher[];
};
