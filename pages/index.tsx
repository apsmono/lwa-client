import { Button, Select, TextField, Typography } from "components/common";
import { GetServerSideProps } from "next";
import CategoryService from "service/category_service";
import { GuestLayout } from "components/layout";
import JobService from "service/job_service";
import { Category, Job } from "service/types";
import { FeaturedJob, Jobs, PopularCategory, Subscribe } from "components/home";
import { useRouter } from "next/router";

interface HomePropsInterface {
  categories: Category[];
  featuredJobs: Job[];
  popularCategories: Category[];
  jobs: Job[];
  totalJobs: number;
  totalPopularCategories: number;
}

function Home(props: HomePropsInterface) {
  const {
    categories,
    featuredJobs,
    popularCategories,
    jobs,
    totalJobs,
    totalPopularCategories,
  } = props;

  const router = useRouter();

  return (
    <GuestLayout
      navBarProps={{ className: "bg-primary-500" }}
      title="Home"
      categories={categories}
    >
      <div className="bg-primary-500">
        <div className="flex mb-8 justify-between p-6 items-center max-w-5xl mx-auto">
          <div className="flex flex-col">
            <p className="font-black mb-4 text-left uppercase font-palo text-7xl">
              Find top talent anywhere <br className="hidden md:block" /> in the
              world
            </p>
            <Typography className="mb-4">
              Making your job search easier by connecting you with companies{" "}
              <br />
              that offer you the freedom to work at home or abroad
            </Typography>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/post-a-job")}
              >
                Post Job
              </Button>
              <Button variant="black" onClick={() => router.push("/jobs")}>
                Search Job
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative w-80 h-[400px]">
            <picture>
              <img src="/home-illustration.png" alt="" />
            </picture>
          </div>
        </div>
      </div>
      <div className="md:px-6 p-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <FeaturedJob jobs={featuredJobs} />
        </div>
        <div className="mb-6">
          <PopularCategory
            totalItems={totalPopularCategories}
            categories={popularCategories}
          />
        </div>
        <div className="mb-6">
          <Jobs jobs={jobs} totalItems={totalJobs} />
        </div>
      </div>
      <Subscribe categories={categories} />
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};

  const categories = await (await CategoryService.gets()).data;
  const popularCategoriesRes = await CategoryService.gets({
    offset: 1,
    limit: 8,
  });
  const featuredJobs = await (
    await JobService.gets({ is_featured: true })
  ).data;
  const jobRes = await JobService.gets({ offset: 1, limit: 7 });

  props.categories = categories;
  props.featuredJobs = featuredJobs;
  props.popularCategories = popularCategoriesRes.data;
  props.totalPopularCategories = popularCategoriesRes.page.totalItems;
  props.jobs = jobRes.data;
  props.totalJobs = jobRes.page.totalItems;

  return {
    props,
  };
};

export default Home;
