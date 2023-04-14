import { PageTitle } from "components/common/dashboard";
import { EmployersLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React from "react";
import { AuthService } from "service/auth_service";
import { User } from "service/types";

interface IEmployersDashboardProps {
  user: User;
}

function EmployersDashboard(props: IEmployersDashboardProps) {
  const { user } = props;
  return (
    <EmployersLayout title="Dashboard" employers={user}>
      <div className="h-[100vh]">
        <PageTitle>Dashboard</PageTitle>
      </div>
    </EmployersLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
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
