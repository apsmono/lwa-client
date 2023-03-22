import { Typography } from "components/common";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import CategoryService from "service/category_service";
import { Category } from "service/types";

interface IPrivacyPageProps {
  categories: Category[];
}

function PrivacyPage(props: IPrivacyPageProps) {
  const { categories } = props;
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
        "We use your personal information to provide you with access to the Platform and its features, to respond to your inquiries, and to provide customer support. We may also use your personal information to send you promotional emails and other communications related to the Platform.",
      ],
    },
    {
      title: "Disclosure of Personal Information",
      policies: [
        "We may disclose your personal information to third-party service providers who assist us in operating the Platform or providing customer support. We may also disclose your personal information if we are required to do so by law or if we believe in good faith that such disclosure is necessary to protect our rights or the rights of others.",
      ],
    },
    {
      title: "Security of Personal Information",
      policies: [
        "We may disclose your personal information to third-party service providers who assist us in operating the Platform or providing customer support. We may also disclose your personal information if we are required to do so by law or if we believe in good faith that such disclosure is necessary to protect our rights or the rights of others.",
      ],
    },
    {
      title: "Cookies",
      policies: [
        "We use cookies and other similar technologies to track user activity on the Platform and to personalize your experience. You can disable cookies in your browser settings, but this may affect your ability to use certain features of the Platform.",
      ],
    },
    {
      title: "Analytics",
      policies: [
        "We use third-party analytics services to collect information about how users interact with the Platform. This information may include your IP address, browser type, device type, and other information about your use of the Platform.",
      ],
    },
    {
      title: "Third-Party Links",
      policies: [
        "The Platform may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or content of these websites or services.",
      ],
    },
    {
      title: "Changes to Privacy Policy",
      policies: [
        "We may update this Privacy Policy from time to time by posting a new version on the Platform. Your continued use of the Platform after any such changes constitutes your acceptance of the updated Privacy Policy.",
      ],
    },
  ];
  return (
    <GuestLayout categories={categories} title="Privacy Policy">
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-4">
        <Typography
          variant="h1"
          className="font-palo font-bold tracking-wide text-center mb-4"
        >
          PRIVACY POLICY
        </Typography>

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

export default PrivacyPage;
