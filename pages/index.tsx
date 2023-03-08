import { Select, TextField, Typography } from "components/common";
import { GetServerSideProps } from "next";
import CategoryService from "service/category_service";
import { GuestLayout } from "components/layout";
import JobService from "service/job_service";
import { Category, Job } from "service/types";
import { FeaturedJob, Jobs, PopularCategory, Subscribe } from "components/home";
import { useRouter } from "next/router";
import { Search } from "react-feather";

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
        <div className="flex mb-8 gap-4 justify-between p-6 items-center max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 w-full md:w-2/3">
            <p className="font-black mb-4 text-left uppercase font-palo text-7xl">
              Find REMOTE WORK TODAY
            </p>
            <Typography className="mb-4">
              Your gateway to the best remote jobs from trusted companies and
              employers. Explore our wide range of categories including
              programming, design, customer service, and more. Find your dream
              job and work remotely!
            </Typography>
            <div className="flex">
              <TextField
                className="rounded-r-none"
                containerProps={{ className: "flex-1" }}
                inputPrefix={
                  <button>
                    <Search size={18} />
                  </button>
                }
              />
              <Select
                options={categories}
                renderOption={(opt) => opt.name}
                buttonProps={{ className: "rounded-l-none border-l-0" }}
                placeholder="Categories"
                className="w-36"
              />
            </div>
            {/* <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/post-a-job")}
              >
                Post Job
              </Button>
              <Button variant="black" onClick={() => router.push("/jobs")}>
                Search Job
              </Button>
            </div> */}
          </div>
          <div className="hidden md:block w-1/3 pl-8">
            <picture>
              <img src="/home-ilustration.png" alt="" className="w-full" />
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
