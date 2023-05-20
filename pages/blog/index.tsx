import { Button, PageTitle, Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { AppContext } from "context/appContext";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useContext, useState } from "react";
import BlogService from "service/blog_service";

import { Blog } from "service/types";
import { dateFormat } from "utils/date";

interface IBlogPageProps {
  blogs: Blog[];
  totalItems: number;
}

function BlogPage(props: IBlogPageProps) {
  const { blogs: blogList = [], totalItems } = props;

  const [offset, setOffset] = useState(2);

  const { setLoading } = useContext(AppContext);

  const [blogs, setBlogs] = useState(blogList);
  const handleShowMoreJobs = async () => {
    try {
      setLoading(true);
      const res = await BlogService.gets({
        offset,
        limit: 6,
      });
      const itemCopy = [...blogs, ...res.data];
      setBlogs(itemCopy);
      setOffset(offset + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestLayout title="Blog">
      <div className="w-full max-w-5xl mx-auto p-6 pb-48">
        <PageTitle>Blog</PageTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {blogs.map((item) => (
            <div key={item.id}>
              <picture>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail}`}
                  alt=""
                  className="rounded-t-xl mb-2"
                />
              </picture>
              <Link href={`/blog/${item.slug}`}>
                <Typography
                  variant="small"
                  className="font-bold uppercase mb-2"
                >
                  {item.title}
                </Typography>
              </Link>
              <Typography variant="xs">
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

        {totalItems > blogs.length && (
          <div className="flex justify-center mt-12">
            <Button onClick={handleShowMoreJobs}>View More</Button>
          </div>
        )}
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};
  const res = await Promise.all([BlogService.gets({ limit: 6 })]);
  props.blogs = res[0].data;
  props.totalItems = res[0].page.totalItems;

  return {
    props,
  };
};

export default BlogPage;
