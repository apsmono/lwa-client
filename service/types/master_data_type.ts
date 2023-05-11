export type LanguageType = {
  id: number;
  name: string;
};

export type LocationType = {
  id: number;
  name: string;
};

export type EmploymentType = {
  id: number;
  name: string;
};

export type JobIndustry = {
  id: number;
  name: string;
};

export type TPackagePerks = {
  id: number;
  perks: string;
  package_id: number;
  is_active: boolean;
};

export type Package = {
  id: number;
  name: string;
  price: number;
  description?: string;
  promo?: string;
  cta_text?: string;
  perks: TPackagePerks[];
};

export type JobSalary = {
  id: number;
  salary: string;
};
