import { Subscribe } from "components/home";
import JobDisplay from "components/jobs/JobDisplay";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import JobService from "service/job_service";
import { Job } from "service/types";
import useAppStore from "store/useAppStore";

interface JobDetailPageProps {
  job: Job;
}

function JobDetailPage(props: JobDetailPageProps) {
  const { job } = props;
  const { categories } = useAppStore();
  return (
    <GuestLayout
      title={`Job Detail | ${job.title}`}
      bottomComponent={<Subscribe categories={categories} />}
    >
      <div className="p-6 mb-12">
        <JobDisplay job={job} className="px-6 max-w-5xl mx-auto" />
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};
  const { id } = context.query;

  const job = await (await JobService.get(+id!)).data;
  if (!job) {
    return {
      notFound: true,
    };
  }
  if (job.status !== "open") {
    return {
      notFound: true,
    };
  }

  props.job = job.job;
  return {
    props,
  };
};

export default JobDetailPage;
