import { PageTitle } from "components/common/dashboard";
import { EmployersLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import { Category, User } from "service/types";

interface IAccountSettingPage {
  categories: Category[];
  user: User;
}

function AccountSettingPage(props: IAccountSettingPage) {
  const { categories, user } = props;

  return (
    <EmployersLayout
      title="Account Settings"
      categories={categories}
      employers={user}
    >
      <PageTitle>Account Settings</PageTitle>
    </EmployersLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  const res = await Promise.all([CategoryService.gets()]);
  props.categories = res[0].data;

  try {
    const user = (await AuthService.fetchMe(context)).data?.user || null;

    props.user = user;
  } catch (error) {
    props.user = null;
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: true,
      },
    };
  }

  return {
    props,
  };
};

export default AccountSettingPage;
