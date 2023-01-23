import { Button, TextField, Typography } from "components/common";
import { GetServerSideProps } from "next";
import CategoryService from "service/category_service";
import { GuestLayout } from "components/layout";
import JobService from "service/job_service";
import { Category, Job } from "service/types";
import { FeaturedJob, Jobs, PopularCategory } from "components/home";
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
    <GuestLayout title="Home" categories={categories}>
      <div className="md:px-6 p-6 max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <Typography
              variant="h1"
              className="font-black mb-4 text-center uppercase font-palo"
            >
              Find top talent anywhere <br className="hidden md:block" /> in the
              world
            </Typography>
            <Typography className="text-center mb-4">
              Making your job search easier by connecting you with companies{" "}
              <br />
              that offer you the freedom to work at home or abroad
            </Typography>
            <div className="flex gap-4">
              <Button variant="secondary">Post a Job</Button>
              <Button variant="black" onClick={() => router.push("/jobs")}>
                Search a Job
              </Button>
            </div>
          </div>
        </div>

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
      <div className="bg-primary-500 p-6">
        <div className="max-w-5xl flex justify-center mx-auto">
          {/* <div className="relative w-56 h-56 sm:block hidden">
            <Image src="/subscribe-illustration.svg" fill alt="Subscribe" />
          </div> */}
          <div className="flex flex-col justify-center gap-2">
            <Typography variant="h3" className="font-bold">
              Subscribe now to receive daily job updates!
            </Typography>
            <TextField placeholder="Type your email here" />
            <div className="flex justify-center">
              <Button variant="black">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
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
