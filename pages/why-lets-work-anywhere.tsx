import { PageTitle, Typography } from "components/common";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
interface IWhyLWAPageProps {}

function WhyLWAPage(props: IWhyLWAPageProps) {
  const items = [
    {
      title: "WIDE REACH",
      items: [
        "Our job board has a large and diverse audience of job seekers who are specifically interested in remote job opportunities. This means that your job posting will be seen by a targeted group of candidates who are actively looking for remote jobs.",
      ],
    },
    {
      title: "ADVANCED SEARCH BOX FILTERS",
      items: [
        "Our job board's advanced search box filters allow job seekers to quickly and easily find remote jobs that match their skills, experience, and preferences. This means that your job posting will be seen by candidates who are a strong fit for the role, which can save you time and resources in the recruiting process.",
      ],
    },
    {
      title: "COMPETITIVE PRICING",
      items: [
        "We offer competitive pricing for job postings, which means that you can post your remote job opportunities without breaking the bank. We also offer different pricing tiers depending on the level of service you require.",
      ],
    },
    {
      title: "STREAMLINED PROCESS",
      items: [
        "Posting your remote job opportunity on our job board is a quick and easy process. Our user-friendly platform allows you to create and manage job postings with ease, and our support team is available to assist you with any questions or issues that may arise.",
      ],
    },
    {
      title: "GREAT SUPPORT",
      items: [
        "We pride ourselves on providing excellent customer support to our employers. Our dedicated support team is available to assist you with any questions or issues that may arise, and we strive to ensure that your experience with our job board is as smooth and successful as possible.",
        "Our remote job board offers a range of benefits to employers who are looking to post remote job opportunities. From our advanced search box filters to our competitive pricing and great support, we're here to help you find the best talent for your remote workforce.",
      ],
    },
  ];
  return (
    <>
      <Head>
        <title>Why Lets Work Anywhere</title>
      </Head>
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <PageTitle>WHY LET’S WORK ANYWHERE?</PageTitle>

        <Typography>
          Our remote job board is a powerful tool for employers who are looking
          to attract top talent for remote job opportunities. Here are just a
          few reasons why you should consider using our platform:
        </Typography>

        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <Typography variant="h5" className="font-bold">
                {item.title}
              </Typography>
              {item.items.map((p, j) => (
                <Typography key={`${j}${i}`}>{p}</Typography>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: {} };
};

export default WhyLWAPage;
