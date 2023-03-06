import { Subscribe } from "components/home";
import JobDisplay from "components/jobs/JobDisplay";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
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
  return (
    <GuestLayout categories={categories} title={`Job Detail | ${job.title}`}>
      <div className="p-6 mb-12">
        <JobDisplay job={job} className="px-6 max-w-5xl mx-auto" />
      </div>
      <Subscribe categories={categories} />
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
