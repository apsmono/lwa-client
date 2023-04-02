import { Card, CardTitle, Typography } from "components/common";
import { PageTitle } from "components/common/dashboard";
import { EmployersLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useMemo, useState } from "react";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import CompanyService from "service/company_service";
import { Category, User } from "service/types";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import { handleInvalidTokenServerSide } from "utils/api";

interface IAnalyticsProps {
  categories: Category[];
  user: User;
  activities: { totalClick: number; title: string; id: number }[];
}

function Analytics(props: IAnalyticsProps) {
  const { categories, user, activities: defaultActivities } = props;
  const [activities] = useState(defaultActivities);

  const clickData = useMemo(() => {
    return activities.map((act, i) => ({
      name: `${act.title} #${i + 1}`,
      amount: act.totalClick,
    }));
  }, [activities]);

  const totalClick = useMemo(() => {
    return clickData.reduce((a, b) => a + b.amount, 0);
  }, [clickData]);
  return (
    <EmployersLayout categories={categories} employers={user} title="Analytics">
      <PageTitle>Analytics</PageTitle>
      <div className="grid grid-cols-3 mb-4">
        <div className="py-6 border-2 border-black bg-secondary-300 rounded-lg text-center">
          <Typography className="font-bold" variant="h4">
            {new Intl.NumberFormat().format(totalClick)}
          </Typography>
          <Typography>Total CTR</Typography>
        </div>
      </div>
      <div>
        <Card className="border-black">
          <CardTitle>CTR Charts</CardTitle>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={clickData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar name="Total" dataKey="amount" fill="#B390F9" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
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
    const user =
      (
        await handleInvalidTokenServerSide(
          () => AuthService.fetchMe(context),
          context
        )
      ).data?.user || null;

    props.user = user;

    const res = await Promise.all([
      handleInvalidTokenServerSide(
        () => CompanyService.getOrderSummary(user.company.id, context),
        context
      ),
      handleInvalidTokenServerSide(
        () => CompanyService.getJobActivities(user.company.id, context),
        context
      ),
    ]);

    props.order_summary = res[0].data;
    props.activities = res[1].data.activities;
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

export default Analytics;
