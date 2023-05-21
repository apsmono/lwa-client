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
      bottomComponent={
        <Subscribe className="max-w-7xl mx-auto" categories={categories} />
      }
    >
      <div className="mb-12">
        <JobDisplay
          job={job}
          className="px-6 max-w-5xl mx-auto"
          showLearnMore={false}
          showShareButton
        />
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};
  const { slug } = context.query;

  const res = await (await JobService.get(slug!.toString())).data;

  const { job } = res;
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

  props.job = job;
  return {
    props,
  };
};

export default JobDetailPage;