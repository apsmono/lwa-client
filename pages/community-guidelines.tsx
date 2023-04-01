import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useMemo } from "react";
import CategoryService from "service/category_service";
import { Category } from "service/types";

interface ICommunityGuidelineProps {
  categories: Category[];
}

function CommunityGuidelinePage(props: ICommunityGuidelineProps) {
  const { categories } = props;
  const items = useMemo(() => {
    return [
      {
        title: "Respect",
        guides: [
          "We expect all members of our community to treat each other with respect and professionalism. This means refraining from personal attacks, harassment, or discrimination based on race, gender, religion, age, or any other personal characteristic.",
        ],
      },
      {
        title: "HONESTY",
        guides: [
          "Employers are expected to provide accurate and honest information about job opportunities, and job seekers are expected to provide accurate and honest information about their skills, experience, and qualifications.",
        ],
      },
      {
        title: "PROFESSIONALISM",
        guides: [
          "Our community is focused on remote work, which requires a high degree of professionalism and self-motivation. Employers are expected to provide clear expectations and guidance to their remote employees, and remote employees are expected to be accountable and productive in their work.",
        ],
      },
      {
        title: "CONFIDENTIALITY",
        guides: [
          "Employers and job seekers are expected to maintain the confidentiality of any sensitive or confidential information shared during the hiring process. This includes, but is not limited to, trade secrets, business strategies, and personal information.",
        ],
      },
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
        title: "REPORTING",
        guides: [
          "If you encounter any behavior that violates these community guidelines, please report it to us immediately. We take all reports seriously and will take appropriate action to ensure that our community remains safe and productive for everyone.",
          "We reserve the right to remove any content or member from our community that violates these guidelines, without notice or explanation. We also reserve the right to modify these guidelines at any time, without notice.",
          "By using our remote job board, you agree to comply with these community guidelines and to help us maintain a safe and productive community for all members.",
        ],
      },
    ];
  }, []);
  return (
    <GuestLayout categories={categories} title="Community Guideline">
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <Typography
          variant="h1"
          className="font-palo font-bold tracking-wide text-center mb-4"
        >
          COMMUNITY GUIDELINES
        </Typography>

        <Typography>
          Our remote job board is a community of job seekers and employers who
          share a common goal: to connect talented professionals with great
          remote job opportunities. To ensure that our community is safe and
          productive for everyone, we have established the following community
          guidelines:
        </Typography>

        {items.map((item, i) => (
          <div key={i}>
            <Typography
              variant="h3"
              className="uppercase font-bold font-palo mb-2"
            >
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

export default CommunityGuidelinePage;
