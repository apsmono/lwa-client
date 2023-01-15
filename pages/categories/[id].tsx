import { Button, TextField, Typography } from "components/common";
import JobCard from "components/home/job/JobCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import CategoryService from "service/category_service";
import JobService from "service/job_service";
import { Category, Job } from "service/types";

interface CategoryDetailPageProps {
  jobs: Job[];
  category: Category;
  categories: Category[];
}

function CategoryDetailPage(props: CategoryDetailPageProps) {
  const { categories, category, jobs } = props;
  const router = useRouter();
  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };
  return (
    <GuestLayout
      title={`Category Detail | ${category.name}`}
      categories={categories}
    >
      <div className="max-w-5xl p-6 mx-auto flex flex-col gap-2 min-h-[70vh]">
        <Typography variant="h1" className="font-bold text-center">
          {category.name} Job
        </Typography>
        <Typography className="text-center">{category.description}</Typography>
        <TextField placeholder="Search Job" />
        <div>
          <Button variant="secondary">Search Job</Button>
        </div>
        <Typography variant="small" className="text-center">
          &quot;{new Intl.NumberFormat().format(jobs.length)}&quot;{" "}
          {category.name} Jobs Available
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
  const { id } = context.query;
  const category = await (await CategoryService.get(+id!)).data.category;
  if (!category) {
    return {
      notFound: true,
    };
  }
  const jobs = await (await JobService.gets({ category_id: id })).data;
  const categories = await (await CategoryService.gets()).data;

  props.category = category;
  props.jobs = jobs;
  props.categories = categories;

  return {
    props,
  };
};

export default CategoryDetailPage;
