import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import BlogService from "service/blog_service";

import CategoryService from "service/category_service";
import { Blog, Category } from "service/types";
import { dateFormat } from "utils/date";

interface IBlogPageProps {
  categories: Category[];
  blogs: Blog[];
}

function BlogPage(props: IBlogPageProps) {
  const { categories, blogs = [] } = props;

  return (
    <GuestLayout categories={categories} title="Blog">
      <div className="w-full max-w-5xl mx-auto p-6 pb-48">
        <Typography
          variant="h1"
          className="font-palo font-bold tracking-wide text-center mb-4"
        >
          BLOG
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((item) => (
            <div key={item.id}>
              <picture>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail}`}
                  alt=""
                  className="rounded-lg"
                />
              </picture>
              <Link href={`/blog/${item.slug}`}>
                <Typography
                  variant="h4"
                  className="font-palo tracking-wide font-bold uppercase"
                >
                  {item.title}
                </Typography>
              </Link>
              <Typography variant="small">
                {dateFormat(
                  item.created_at,
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
  const props: any = {};
  const res = await Promise.all([CategoryService.gets(), BlogService.gets()]);
  props.categories = res[0].data;
  props.blogs = res[1].data;

  return {
    props,
  };
};

export default BlogPage;
