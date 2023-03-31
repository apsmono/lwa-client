import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

import BlogService from "service/blog_service";
import CategoryService from "service/category_service";
import { Blog, Category } from "service/types";

interface IBlogDetailPageProps {
  categories: Category[];
  blog: Blog;
}

function BlogDetailPage(props: IBlogDetailPageProps) {
  const { categories, blog } = props;
  return (
    <GuestLayout
      categories={categories}
      title={`${blog.title} | LWA`}
      meta={
        <>
          <meta name="title" content={blog.title} />
          <meta name="description" content="Let's work anywhere" />
        </>
      }
    >
      <div className="max-w-5xl mx-auto p-6">
        <Typography
          variant="h1"
          className="font-palo font-bold tracking-wide uppercase text-center mb-4"
        >
          {blog.title}
        </Typography>

        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="mb-4"
        />

        <Typography className="text-center">Share this article:</Typography>
        <div className="flex justify-center gap-2">
          <WhatsappShareButton
            url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
            title={`${blog.title} - LWA`}
            separator=":: "
          >
            <WhatsappIcon
              size={36}
              bgStyle={{ fill: "transparent" }}
              className="bg-gray-400 hover:bg-gray-500 transition-all rounded-full"
              round
            />
          </WhatsappShareButton>
          <FacebookShareButton
            url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
            quote={`${blog.title} - LWA`}
          >
            <FacebookIcon
              size={36}
              bgStyle={{ fill: "transparent" }}
              className="bg-gray-400 hover:bg-gray-500 transition-all rounded-full"
              round
            />
          </FacebookShareButton>
          <TwitterShareButton
            url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
            title={`${blog.title} - LWA`}
          >
            <TwitterIcon
              size={36}
              bgStyle={{ fill: "transparent" }}
              className="bg-gray-400 hover:bg-gray-500 transition-all rounded-full"
              round
            />
          </TwitterShareButton>
          <LinkedinShareButton
            url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`}
            title={`${blog.title} - LWA`}
          >
            <LinkedinIcon
              size={36}
              bgStyle={{ fill: "transparent" }}
              className="bg-gray-400 hover:bg-gray-500 transition-all rounded-full"
              round
            />
          </LinkedinShareButton>
        </div>
      </div>
    </GuestLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  const res = await Promise.all([
    CategoryService.gets(),
    BlogService.get(slug?.toString() || ""),
  ]);
  const props: any = {};

  props.categories = res[0].data;
  props.blog = res[1].data.blog;

  if (!props.blog) {
    return {
      notFound: true,
    };
  }
  return {
    props,
  };
};
export default BlogDetailPage;
