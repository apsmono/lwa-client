import { PageTitle, Typography } from "components/common";
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
  blog: Blog;
}

function BlogDetailPage(props: IBlogDetailPageProps) {
  const { blog } = props;

  return (
    <GuestLayout
      title={`${blog.title} | LWA`}
      meta={
        <>
          <meta name="title" content={blog.title} />
          <meta name="description" content="Let's work anywhere" />
        </>
      }
    >
      <div className="max-w-5xl mx-auto p-6">
        <PageTitle>{blog.title}</PageTitle>

        <picture>
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.thumbnail}`}
            alt=""
            className="w-full rounded-xl my-6 mt-12"
          />
        </picture>

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
  const res = await Promise.all([BlogService.get(slug?.toString() || "")]);
  const props: any = {};
  props.blog = res[0].data.blog;

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
