import { Button, Select, TextField, Typography } from "components/common";
import JobCard from "components/home/job/JobCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import CategoryService from "service/category_service";
import JobService from "service/job_service";
import { Category, Job } from "service/types";

interface JobListPageProps {
  jobs: Job[];
  category?: Category;
  categories: Category[];
}

function JobListPage(props: JobListPageProps) {
  const { categories, category, jobs } = props;
  const router = useRouter();
  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const title = useMemo(() => {
    if (!category) return "Jobs";
    return `Jobs - ${category.name}`;
  }, [category]);
  return (
    <GuestLayout title={title} categories={categories}>
      <div className="max-w-5xl p-6 mx-auto flex flex-col gap-2 min-h-[70vh]">
        {category ? (
          <>
            <Typography variant="h1" className="font-bold text-center">
              {category.name} Job
            </Typography>
            <Typography className="text-center">
              {category.description}
            </Typography>
          </>
        ) : null}
        <TextField placeholder="Search Job" />
        <div className="flex gap-4">
          <Select options={[{ text: "Job Type", value: "" }]} />
          <Select options={[{ text: "Location", value: "" }]} />
          <Select options={[{ text: "Industry", value: "" }]} />
          <Select options={[{ text: "Language", value: "" }]} />
        </div>
        <Typography variant="small" className="text-center">
          &quot;{new Intl.NumberFormat().format(jobs.length)}&quot; Jobs
          Available
        </Typography>
        {jobs.map((job) => (
          <div className="mb-2" key={job.id}>
            <JobCard onClick={() => handleClick(job)} job={job} />
          </div>
        ))}
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};
  const { category_id, title } = context.query;
  const jobParams: any = {};

  if (category_id) {
    const category = await (
      await CategoryService.get(+category_id)
    ).data.category;
    jobParams.category_id = category_id;
    props.category = category;
  }
  if (title) props.title = title;

  const jobs = await (await JobService.gets(jobParams)).data;
  const categories = await (await CategoryService.gets()).data;

  props.jobs = jobs;
  props.categories = categories;

  return {
    props,
  };
};

export default JobListPage;
