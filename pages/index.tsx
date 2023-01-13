import { Button, Typography } from "components/common";
import { GetServerSideProps } from "next";
import CategoryService from "service/category_service";
import { GuestLayout } from "components/layout";
import JobService from "service/job_service";
import { Category, Job } from "service/types";
import { FeaturedJob } from "components/home";

interface HomePropsInterface {
  categories: Category[];
  featuredJobs: Job[];
}

function Home(props: HomePropsInterface) {
  const { categories, featuredJobs } = props;
  return (
    <GuestLayout title="Home" categories={categories}>
      <div className="md:px-6 py-6">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <Typography variant="h2" className="font-bold mb-4 text-center">
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
                className="border-black border-2 rounded-l-full py-2 px-4 w-2/3"
                placeholder="Search a Job"
              />
              <select className="border-black border-2 rounded-r-full border-l-0 w-1/3">
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

        <FeaturedJob jobs={featuredJobs} />
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};

  const categories = await (await CategoryService.gets()).data;
  const featuredJobs = await (
    await JobService.gets({ is_featured: true })
  ).data;

  props.categories = categories;
  props.featuredJobs = featuredJobs;

  return {
    props,
  };
};

export default Home;
