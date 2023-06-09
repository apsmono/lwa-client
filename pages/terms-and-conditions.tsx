import { PageTitle, Typography } from "components/common";

import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

interface ITermsAndConditionProps {}

function TermsAndConditionPage(props: ITermsAndConditionProps) {
  const items = [
    {
      title: "Acceptance",
      terms: [
        `Lets Work Anywhere ("Remotive", "we", "us", or "our") is the owner and operator of the website www.letsworkanywhere.com, as well as any mobile versions and other websites we may operate in the future that link to these Conditions of Use (collectively, "Site").`,
        `You accept these Terms of Use (defined below) and any other documents they specifically incorporate by reference by visiting or using the Site.`,
        "Stop using Lets Work Anywhere if you do not agree with the terms.",
      ],
    },
    {
      title: "Disclaimers",
      terms: [
        "We make no representations or warranties regarding the accuracy, reliability, or completeness of the information on the platform. We are not responsible for any loss or damage resulting from your use of the platform.",
        "Our liability to you for any claim arising out of or relating to these Terms of the platform shall be limited to the amount paid by you, if any, to use the platform.",
      ],
    },
    {
      title: "General Terms",
      terms: [
        "This Service is operated and provided by Let’s Work Anywhere. Let’s Work Anywhere makes no representations that this service is appropriate or available for use in all locations. Those who access or use the service from their jurisdictions do so at their own risk and are responsible for compliance with local law.",
      ],
    },
    {
      title: "Intellectual Property",
      terms: [
        "a. Users agree not to post content that is illegal, harmful, fraudulent, discriminatory, or otherwise offensive.",
        "b. Prohibited content includes, but is not limited to:",
        "i. Content that is defamatory, libelous, or malicious;",
        "ii. Content that infringes upon the intellectual property rights of others, including copyright, trademark, and patent;",
        "iii. Content that is obscene, pornographic, or sexually explicit;",
        "iv. Content that promotes or incites violence, terrorism, or hate speech;",
        "v. Content that is false or misleading;",
        "vi. Content that contains viruses, malware, or other harmful or unethical code;",
        "vii. Content that violates the privacy rights of others;",
        "viii. Content that is intended to deceive, scam, or defraud others;",
        "ix. Content that is designed to drive traffic to a third-party site or engage in other unethical practices.",
        "c. Employers are solely responsible for the accuracy and content of their job postings. We reserve the right to remove any job posting that violates these Terms or any applicable laws or regulations.",
        "d. Job seekers are solely responsible for the accuracy and completeness of their job applications.",
      ],
    },
    {
      title: "User Responsibility",
      terms: [
        "a. Users are responsible for maintaining the security of their accounts, including their login credentials and passwords.",
        "b. Users are responsible for all content they post on the service, including job listings, comments, and other materials. Users agree not to post content that is illegal, harmful, fraudulent, discriminatory, or otherwise offensive.",
        "c.Employers are solely responsible for the accuracy and content of their job postings. We reserve the right to remove any job posting that violates these Terms or any applicable laws or regulations.",
        "d. Job Applications: Job seekers are solely responsible for the accuracy and completeness of their job applications. Employers are responsible for reviewing and evaluating job applications in a timely and professional manner.",
        "e. Users acknowledge and agree that Company is not responsible for any loss or damage arising from their failure to comply with these security obligations.",
        "f. Users agree to indemnify and hold harmless Company, its affiliates, officers, directors, employees, agents, and licensors, from and against any claims, actions, or demands, including without limitation reasonable legal fees, arising from or related to their use of the Service or their violation of these Terms of Service.",
      ],
    },
    {
      title: "Taxes",
      terms: [
        "Let’s Work Anywhere is not responsible for any taxes or fees that may be due as a result of transactions between employers and job seekers. Employers are solrely responsible for any taxes and fees owed to their local or national authorities as a result of hiring job",
      ],
    },
    {
      title: "Renewals",
      terms: [
        "Job posts will be automatically renewed each month charging the employer for the job post. The employer will need to delete or pause the job post to discontinue the auto renewal.",
      ],
    },
    {
      title: "Disclaimer of Warranties and Limitation of Liability",
      terms: [
        `a. Let’s Work Anywhere provides the Service "as is" and without warranty of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose.`,
        "b. Let’s Work Anywhere shall not be liable for any indirect, special, incidental, or consequential damages, including without limitation damages for loss of profits, goodwill, use, data or other intangible losses, arising out of or in connection with the use or inability to use the Service.",
      ],
    },
    {
      title: "Modifications",
      terms: [
        "We reserve the right to modify these Terms at any time, without notice. Your continued use of the Platform after any such modifications shall constitute your acceptance of the modified Terms.",
      ],
    },
  ];
  return (
    <>
      <Head>
        <title>Terms and Conditions</title>
      </Head>
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <PageTitle>Terms & Conditions</PageTitle>

        <Typography>
          Welcome to our job board! These terms and conditions
          (&quot;Terms&quot;) govern your use of our job board platform (the
          &quot;Platform&quot;) as a job seeker or employer.
        </Typography>

        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <Typography className="font-bold">{item.title}</Typography>
              {item.terms.map((term, j) => (
                <Typography key={`${i}${j}`}>{term}</Typography>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default TermsAndConditionPage;
