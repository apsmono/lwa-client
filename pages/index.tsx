import { Button, TextField, Typography } from "components/common";
import { GetServerSideProps } from "next";
import CategoryService from "service/category_service";
import { GuestLayout } from "components/layout";
import JobService from "service/job_service";
import { Category, Job } from "service/types";
import { FeaturedJob, Jobs, PopularCategory } from "components/home";
import Image from "next/image";

interface HomePropsInterface {
  categories: Category[];
  featuredJobs: Job[];
  popularCategories: Category[];
  jobs: Job[];
}

function Home(props: HomePropsInterface) {
  const { categories, featuredJobs, popularCategories, jobs } = props;

  return (
    <GuestLayout title="Home" categories={categories}>
      <div className="md:px-6 p-6 max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <Typography
              variant="h2"
              className="font-black mb-4 text-center uppercase"
            >
              Find top talent anywhere in the world
            </Typography>
            <Typography className="text-center mb-4">
              Making your job search easier by connecting you with companies{" "}
              <br />
              that offer you the freedom to work at home or abroad
            </Typography>
            <div className="flex mb-4">
              <input
                type="text"
                className="border-black border-2 rounded-l-full py-2 px-4 w-2/3 with-shadow"
                placeholder="Search a Job"
              />
              <select className="border-black border-2 rounded-r-full border-l-0 w-1/3 with-shadow">
                <option value="">Categories</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="secondary">Search</Button>
          </div>
          <picture className="hidden lg:block">
            <img
              src="/home-ilustration.svg"
              alt="Ilustration"
              className="w-96"
            />
          </picture>
        </div>

        <div className="mb-6">
          <FeaturedJob jobs={featuredJobs} />
        </div>
        <div className="mb-6">
          <PopularCategory categories={popularCategories} />
        </div>
        <div className="mb-6">
          <Jobs jobs={jobs} />
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
  const popularCategories = await (
    await CategoryService.gets({ offset: 1, limit: 8 })
  ).data;
  const featuredJobs = await (
    await JobService.gets({ is_featured: true })
  ).data;
  const jobs = await (await JobService.gets()).data;

  props.categories = categories;
  props.featuredJobs = featuredJobs;
  props.popularCategories = popularCategories;
  props.jobs = jobs;

  return {
    props,
  };
};

export default Home;
