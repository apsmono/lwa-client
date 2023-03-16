import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";

import CategoryService from "service/category_service";
import { Category } from "service/types";
import { dateFormat } from "utils/date";

interface IBlogPageProps {
  categories: Category[];
}

function BlogPage(props: IBlogPageProps) {
  const { categories } = props;
  const arr = Array.from(Array(12).keys());

  return (
    <GuestLayout categories={categories} title="Blog">
      <div className="w-full max-w-5xl mx-auto p-6">
        <Typography
          variant="h1"
          className="font-palo font-bold tracking-wide text-center mb-4"
        >
          BLOG
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {arr.map((item) => (
            <div key={item}>
              <picture>
                <img
                  src="https://dummyimage.com/400x220/fefefe/000"
                  alt=""
                  className="border-2 border-black rounded-lg"
                />
              </picture>
              <Typography
                variant="h4"
                className="font-palo tracking-wide font-medium"
              >
                Lorem ipsum dolor sit amet.
              </Typography>
              <Typography variant="small">
                {dateFormat(
                  new Date().toLocaleDateString(),
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                  "id-ID"
                )}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  const res = await Promise.all([CategoryService.gets()]);
  props.categories = res[0].data;

  return {
    props,
  };
};

export default BlogPage;
