import { Typography } from "components/common";
import { Subscribe } from "components/home";
import JobCard from "components/home/job/JobCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React from "react";
import { Globe, Mail, MapPin } from "react-feather";
import CategoryService from "service/category_service";
import CompanyService from "service/company_service";
import JobService from "service/job_service";
import { Category, Company, Job } from "service/types";

interface CompanyDetailPageProps {
  company: Company;
  categories: Category[];
  similarJobs: Job[];
}

function CompanyDetailPage(props: CompanyDetailPageProps) {
  const { company, categories, similarJobs } = props;
  return (
    <GuestLayout
      categories={categories}
      title={`Company Detail | ${company.company_name}`}
    >
      <div className="mx-auto p-6 max-w-5xl">
        <div className="flex sm:flex-row flex-col justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative h-14 w-14">
              <Image
                fill
                src={`${process.env.NEXT_PUBLIC_API_URL}${company.company_logo}`}
                alt="Logo"
              />
            </div>
            <Typography variant="h3" className="font-bold">
              {company.company_name}
            </Typography>
          </div>
          <ul>
            <li className="flex gap-2 items-center">
              <MapPin size={18} /> {company.company_headquarter}
            </li>
            <li className="flex gap-2 items-center">
              <Globe size={18} /> {company.company_url}
            </li>
            <li className="flex gap-2 items-center">
              <Mail size={18} /> {company.company_email}
            </li>
          </ul>
        </div>

        <Typography className="font-bold" variant="h6">
          About
        </Typography>
        <Typography className="whitespace-pre-line text-justify mb-4">
          {company.company_about}
        </Typography>
        <Typography className="font-bold" variant="h6">
          Benefits
        </Typography>
        <Typography className="whitespace-pre-line text-justify mb-4">
          {company.company_offer ?? "-"}
        </Typography>

        <Typography variant="h6" className="font-bold">
          Jobs at {company.company_name}
        </Typography>
        {company.jobs.map((job) => {
          const item = { ...job };
          item.company_logo = company.company_logo;
          return (
            <div key={job.id} className="mb-4">
              <JobCard job={item} showStatus={false} />
            </div>
          );
        })}
      </div>

      <div className="bg-gray-100">
        <div className="mx-auto p-6 max-w-5xl">
          <Typography variant="h6" className="font-bold">
            Similar Jobs
          </Typography>
          {similarJobs.length === 0 && (
            <div className="flex justify-center">
              <Typography>No similar jobs available</Typography>
            </div>
          )}
          {similarJobs.map((job) => {
            const item = { ...job };
            item.company_logo = company.company_logo;
            return (
              <div key={job.id} className="mb-2">
                <JobCard job={item} showStatus={false} />
              </div>
            );
          })}
        </div>
      </div>
      <Subscribe categories={categories} />
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const company = await (await CompanyService.get(+id!)).data.company;
  const similarJobs = await (await JobService.getSimilarJobs(+id!)).data;
  if (!company) {
    return {
      notFound: true,
    };
  }
  const categories = await (await CategoryService.gets()).data;
  const props = {
    company,
    categories,
    similarJobs,
  };
  return {
    props,
  };
};

export default CompanyDetailPage;
