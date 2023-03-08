import { EmployersLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import { Category, User } from "service/types";

interface IEmployersDashboardProps {
  categories: Category[];
  user?: User;
}

function EmployersDashboard(props: IEmployersDashboardProps) {
  const { categories, user } = props;
  return (
    <EmployersLayout title="Dashboard" categories={categories} employers={user}>
      <div className="h-[100vh]">Dashboard</div>
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

export default EmployersDashboard;
