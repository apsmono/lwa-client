import { Button, Typography } from "components/common";
import { JobSnippet } from "components/jobs";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import CategoryService from "service/category_service";
import JobService from "service/job_service";
import { Category, Job } from "service/types";

interface JobDetailPageProps {
  job: Job;
  categories: Category[];
}

function JobDetailPage(props: JobDetailPageProps) {
  const { job, categories } = props;
  const router = useRouter();
  return (
    <GuestLayout categories={categories} title={`Job Detail | ${job.title}`}>
      <div className="p-6">
        <div className="p-6 max-w-5xl mx-auto border-2 border-black shadow-md rounded-lg flex flex-col gap-4">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-2">
            <JobSnippet
              job={job}
              className="sm:flex-row flex-col items-center"
            />
            <div>
              <Button variant="secondary" className="md:w-auto w-full">
                Apply Now
              </Button>
            </div>
          </div>
          <Typography className="whitespace-pre-line text-justify">
            {job.description}
          </Typography>

          <div className="border-2 border-black rounded-lg p-4">
            <Typography className="font-bold">
              What the company offer:
            </Typography>
            <Typography className="whitespace-pre-line">
              {job.company_offer ?? "-"}
            </Typography>
          </div>
          <div className="border-2 border-black rounded-lg bg-primary-500">
            <div className="p-4">
              <div className="flex mb-4 gap-4 items-center">
                <div className="relative w-14 h-14">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${job.company_logo}`}
                    fill
                    alt="Company logo"
                  />
                </div>
                <Typography className="font-bold" variant="h4">
                  {job.company_name}
                </Typography>
              </div>
              <Typography className="font-bold">About Us:</Typography>
              <Typography className="whitespace-pre-line text-justify">
                {job.company_about}
              </Typography>
              <div className="flex justify-end">
                <div>
                  <Button
                    onClick={() => router.push(`/companies/${job.company_id}`)}
                    variant="link"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};
  const { id } = context.query;

  const job = await (await JobService.get(+id!)).data;
  const categories = await (await CategoryService.gets()).data;
  if (!job) {
    return {
      notFound: true,
    };
  }
  props.categories = categories;

  props.job = job.job;
  return {
    props,
  };
};

export default JobDetailPage;
