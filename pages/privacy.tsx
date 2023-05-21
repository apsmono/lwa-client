import { PageTitle, Typography } from "components/common";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";

interface IPrivacyPageProps {}

function PrivacyPage(props: IPrivacyPageProps) {
  const items = [
    {
      title: "Personal Information",
      policies: [
        "We may collect personal information from you when you create an account on the Platform, post a job listing, apply for a job, or contact us with a question or inquiry. This may include your name, email address, phone number, and other information that you voluntarily provide.",
      ],
    },
    {
      title: "Use of Personal Information",
      policies: [
        "We may use your personal information to provide you with access to the platform and its features, to respond to your inquiries, and to provide customer support. We may also use your personal information to send you promotional emails and other communications related to the platform. We will not disclose your information to third party marketers",
      ],
    },
    {
      title: "Security of Personal Information",
      policies: [
        "We take reasonable measures to protect your personal information from unauthorised access, use, or disclosure. It is important to remember that no method of transmission over the internet or electronic storage is completely foolproof and we’re not responsible for any actions from third party that receive such as information. This is why we continuously monitor and update our security measures to stay ahead of potential threats and maintain the highest level of protection for your information.",
      ],
    },
    {
      title: "Third-Party Links",
      policies: [
        "The Platform may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or content of these websites or services.",
      ],
    },
    {
      title: "Updating Information",
      policies: [
        `You have the right to update and maintain the accuracy of your personal details by logging in to your account or emailing us on contact@letsworkanywhere.com. If you wish to update your subscription settings or unsubscribe from our marketing communications, you can easily do so by clicking the "unsubscribe" link in our emails.`,
      ],
    },
    {
      title: "Third Party Privacy Policies",
      policies: [
        "This Privacy Policy applies solely to the information collected and disclosed from you on letsworkanywhere.com. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We cannot be held responsible for the protection and privacy of any information you provide while visiting such sites.",
      ],
    },
    {
      title: "Changes to Privacy Policy",
      policies: [
        "We may update this Privacy Policy from time to time by posting a new version on the platform. Your continued use of the Platform after any such changes constitutes your acceptance of the updated Privacy Policy. We will notify you promptly. We may send you an email notification or display a notice here, or on our website to ensure that you are aware of the updates.",
      ],
    },
  ];
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <PageTitle>Privacy Policy</PageTitle>

        <Typography>
          This Privacy Policy describes how we collect, use, and protect the
          personal information of users of our online remote job board (the
          &quot;Platform&quot;). By using the Platform, you consent to the
          collection, use, and disclosure of your personal information as
          described in this Privacy Policy.
        </Typography>

        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <Typography className="font-bold">
                {i + 1}. {item.title}
              </Typography>
              {item.policies.map((p, j) => (
                <Typography key={`${i}${j}`}>{p}</Typography>
              ))}
            </React.Fragment>
          ))}
          <Typography>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at hello@letsworkanywhere.com
          </Typography>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: {} };
};

export default PrivacyPage;
