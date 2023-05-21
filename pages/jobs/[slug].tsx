import { Subscribe } from "components/home";
import JobDisplay from "components/jobs/JobDisplay";
import { GetServerSideProps } from "next";
import Head from "next/head";
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
    <>
      <Head>
        <title>Jobs | {`${job.company_name} - ${job.title}`}</title>
      </Head>
      <div className="mb-12">
        <JobDisplay
          job={job}
          className="px-6 max-w-5xl mx-auto"
          showLearnMore={false}
          showShareButton
        />
      </div>
      <div className="pt-12 px-6">
        <Subscribe className="max-w-7xl mx-auto" categories={categories} />
      </div>
    </>
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
