import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { Typography } from "components/common";
import PackageCard from "components/employers/post-a-job/PackageCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useMemo } from "react";

import CategoryService from "service/category_service";
import PackageService from "service/package_service";
import { Category, Package } from "service/types";

interface IFaqPageProps {
  categories: Category[];
  packages: Package[];
}

function FaqPage(props: IFaqPageProps) {
  const { categories, packages } = props;

  const faqItems = useMemo(() => {
    return [
      {
        title: "What is Let's Work Anywhere?",
        content:
          "LWA is an online platform that allows employers to post job openings and job seekers to search and apply for jobs.",
      },
      {
        title: "How do I search for jobs on the job board?",
        content:
          "Use the search bar to enter keywords related to the type of job you are looking for. You can also filter results by job category, location, job type and more.",
      },
      {
        title: "How do I apply for jobs on the job board?",
        content:
          "Click on the job posting to view the job description and requirements. When you are ready, click on ‘Apply’ button and it will direct you to employers’ application page.",
      },
      {
        title: "How do I create a job posting as an employer?",
        content: `Click on the "Post a Job" button on the our homepage, and follow the prompts to create your job posting.`,
      },

      {
        title: "How much does it cost to post on Let’s Work Anywhere?",
        content: (
          <>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-3">
              {packages.map((item, i) => (
                <PackageCard item={item} key={item.id} isSelected={i === 0} />
              ))}
            </div>
            Want to post more than 10+ jobs? Contact us for customised packages!
          </>
        ),
      },
      {
        title:
          "What types of remote jobs are available on Let’s Work Anywhere?",
        content:
          "Our remote job board offers a wide range of job opportunities across different industries and skill sets. Some popular remote job categories include customer service, software development, marketing, and design.",
      },
      {
        title: "How long will my job posting be visible on the job board?",
        content:
          "The duration of job postings varies dependent on the selected job post. Paid postings may be visible for 30 days, while the free posting will be visible for 7 days.",
      },
      {
        title: "Can I edit or delete my job posting after it has been posted?",
        content:
          "Yes, you can edit, pause or delete your job posting from your employer dashboard or by contacting the job board's support team.",
      },
      {
        title: "How do I contact the Let’s Work Anywhere support team?",
        content:
          "Click on the Chat Box on the bottom-right of your screen and enter your question or reach us at hello@letsworkanywhere.com and our support team will respond to you as soon as possible.",
      },
      {
        title: "Is my personal information secure on the job board?",
        content:
          "Our job board take measures to protect the privacy and security of their users. Read the job board's privacy policy to learn more about our data protection practices.",
      },
    ];
  }, []);
  return (
    <GuestLayout title="Faq" categories={categories}>
      <Typography
        variant="h1"
        className="font-palo font-bold tracking-wide text-center mb-4"
      >
        FAQ
      </Typography>

      <div className="flex flex-col gap-4 max-w-6xl mx-auto p-6">
        {faqItems.map((faq, i) => (
          <div key={i} className="bg-white rounded-lg border border-black p-4">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={clsx([open && "font-medium underline"])}
                  >
                    {faq.title}
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-2">
                    {faq.content}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};

  const categories = await (await CategoryService.gets()).data;
  const packages = await (await PackageService.gets()).data;

  props.categories = categories;
  props.packages = packages;

  return {
    props,
  };
};

export default FaqPage;
