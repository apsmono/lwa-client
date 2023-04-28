import { Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import { Subscribe } from "components/home";
import Feature from "components/home/featured-job/Feature";
import JobCard from "components/home/job/JobCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useMemo } from "react";
import CompanyService from "service/company_service";
import JobService from "service/job_service";
import { Company, Job } from "service/types";
import useAppStore from "store/useAppStore";

interface CompanyDetailPageProps {
  company: Company;
  similarJobs: Job[];
}

function CompanyDetailPage(props: CompanyDetailPageProps) {
  const { company, similarJobs } = props;
  const { categories } = useAppStore();

  const companyJobs = useMemo(() => {
    return company.jobs.filter((j) => j.status === "open");
  }, [company]);
  return (
    <GuestLayout
      title={`Company Detail | ${company.company_name}`}
      bottomComponent={
        <Subscribe categories={categories} className="max-w-7xl mx-auto" />
      }
      addBottomSpace={false}
    >
      <div className="mx-auto p-6 max-w-5xl">
        <div className="flex sm:flex-row flex-col justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CompanyLogo src={company.company_logo} />
            <Typography variant="h3" className="font-bold">
              {company.company_name}
            </Typography>
          </div>
        </div>

        <div className="flex mt-4 mb-8 gap-2">
          <Feature
            className="border border-primary-500"
            icon="📧"
            title={company.company_email}
          />
          <Feature
            className="border border-primary-500"
            icon="📍"
            title={company.company_headquarter}
          />
          <Feature
            className="border border-primary-500"
            icon="🌐"
            title={company.company_url}
          />
        </div>

        <Typography className="font-bold mb-2" variant="h4">
          About Overleaf
        </Typography>
        <Typography className="whitespace-pre-line text-justify mb-8">
          {company.company_about}
        </Typography>
        <Typography className="font-bold mb-2" variant="h4">
          Benefits
        </Typography>
        <Typography className="whitespace-pre-line text-justify mb-8">
          {company.company_offer ?? "-"}
        </Typography>

        <Typography variant="h4" className="font-bold mb-2">
          Jobs at {company.company_name}
        </Typography>
        {companyJobs.map((job) => {
          const item = { ...job };
          item.company_logo = company.company_logo;
          return (
            <div key={job.id} className="mb-4">
              <JobCard job={item} showStatus={false} />
            </div>
          );
        })}
      </div>

      <div className="bg-primary-100 pb-8 mb-48 mt-4">
        <div className="mx-auto p-6 max-w-5xl">
          <Typography variant="h5" className="font-bold mb-2">
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
              <div key={job.id} className="mb-4">
                <JobCard job={item} showStatus={false} />
              </div>
            );
          })}
        </div>
      </div>
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
  const props = {
    company,
    similarJobs,
  };
  return {
    props,
  };
};

export default CompanyDetailPage;
