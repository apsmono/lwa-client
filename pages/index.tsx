import { PageTitle, TextField, Typography } from "components/common";
import { GetServerSideProps } from "next";
import JobService from "service/job_service";
import { Job } from "service/types";
import { FeaturedJob, Jobs, Subscribe } from "components/home";
import useAppStore from "store/useAppStore";
import { useForm } from "react-hook-form";
import { getURLSearchParams } from "utils/api";
import { useRouter } from "next/router";
import Head from "next/head";

interface HomePropsInterface {
  featuredJobs: Job[];
  jobs: Job[];
  totalJobs: number;
}

function Home(props: HomePropsInterface) {
  const { featuredJobs, jobs, totalJobs } = props;
  const { categories } = useAppStore();
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();

  const onSubmit = (val: any) => {
    const payload: any = {};

    if (val.title) payload.title = val.title;
    if (val.category_id) payload.category_id = val.category_id;
    const params = getURLSearchParams(payload);

    router.push(`/jobs?${params}`);
  };

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col md:mb-16 gap-4 justify-between p-6 items-center max-w-5xl mx-auto">
        <div className="max-w-xl flex flex-col gap-2">
          <PageTitle className="mb-4">Find Remote Work Today</PageTitle>

          <Typography className="mb-4 text-center">
            Your gateway to the best remote jobs from trusted companies and
            employers. <br /> Explore our wide range of categories including
            programming, design, customer service, and more. Find your dream job
            and work remotely!
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
            <TextField
              containerProps={{ className: "w-full" }}
              inputSuffix={<button type="button">🔍</button>}
              placeholder="Search keyword, e.g. Location, Full-Time, Programmer"
              register={register}
              name="title"
              rounded
            />
          </form>
        </div>
      </div>
      <div className="mb-6 py-6">
        <FeaturedJob jobs={featuredJobs} />
      </div>
      <div className="md:px-6 p-6 mx-auto">
        <Jobs categories={categories} jobs={jobs} totalItems={totalJobs} />
      </div>
      <div className="px-6">
        <Subscribe className="max-w-7xl mx-auto" categories={categories} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};

  const featuredJobs = await (
    await JobService.gets({ is_featured: true, status: "open", limit: 8 })
  ).data;
  const jobRes = await JobService.gets({ offset: 1, limit: 7, status: "open" });

  props.featuredJobs = featuredJobs;
  props.jobs = jobRes.data;
  props.totalJobs = jobRes.page.totalItems;

  return {
    props,
  };
};

export default Home;
