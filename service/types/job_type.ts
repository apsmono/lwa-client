export type Job = {
  id: number;
  title: string;
  apply_link: string;
  category_id: number;
  package_id: number;
  skill: string;
  employment_type: string;
  is_worldwide: boolean;
  location: string;
  language: string;
  timezone: string;
  salary: string;
  description: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  company_name: string;
  company_email: string;
  company_url: string;
  company_logo: string;
  company_about: string;
  category_name: string;
  company_offer?: string;
  company_id: number;
};
