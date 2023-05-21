import { PageTitle, Typography } from "components/common";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useMemo } from "react";

interface ICommunityGuidelineProps {}

function CommunityGuidelinePage(props: ICommunityGuidelineProps) {
  const items = useMemo(() => {
    return [
      {
        title: "Posting",
        guides: [
          "Job postings should be specifically for remote work opportunities, and should not include job descriptions for non-remote work opportunities.",
          "Job postings must not include language or requirements that discriminate based on race, gender, age, religion, sexual orientation, or any other legally protected characteristic.",
          "Job postings must accurately describe the job duties, qualifications, compensation, and other relevant details. Misleading or false job postings are not allowed and may result in removal from the platform.",
          "Job postings must not include spam or scams. This includes job postings that require payment for application, job postings that are not legitimate work opportunities, and job postings that require personal information or financial information.",
        ],
      },
      {
        title: "Reporting",
        guides: [
          "If you encounter any behavior that violates these community guidelines, please report it to us immediately. We take all reports seriously and will take appropriate action to ensure that our community remains safe and productive for everyone.",

          "We reserve the right to remove any content or member from our community that violates these guidelines, without notice or explanation. We also reserve the right to modify these guidelines at any time, without notice.",
          "By using our remote job board, you agree to comply with these community guidelines and to help us maintain a safe and productive community for all members.",
        ],
      },
    ];
  }, []);
  return (
    <>
      <Head>
        <title>Community Guideline</title>
      </Head>
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <PageTitle>Community Guidelines</PageTitle>

        <Typography>
          Our remote job board is a community of job seekers and employers who
          share a common goal: to connect talented professionals with great
          remote job opportunities. To ensure that our community is safe and
          productive for everyone, we have established the following community
          guidelines:
        </Typography>

        {items.map((item, i) => (
          <div key={i}>
            <Typography variant="h6" className="font-bold mb-2">
              {i + 1}. {item.title}
            </Typography>
            <div className="flex flex-col gap-2">
              {item.guides.map((guide, j) => (
                <Typography key={`${i}${j}`}>{guide}</Typography>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default CommunityGuidelinePage;
