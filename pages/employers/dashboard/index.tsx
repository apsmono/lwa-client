import { PageTitle } from "components/common/dashboard";
import { EmployersLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthService } from "service/auth_service";
import CompanyService from "service/company_service";
import { User } from "service/types";
import { handleInvalidTokenServerSide } from "utils/api";
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
import { useCurrentPng } from "recharts-to-png";
import { saveAs } from "file-saver";
import {
  Button,
  Card,
  CardTitle,
  TextField,
  Typography,
} from "components/common";
import Head from "next/head";

interface IEmployersDashboardProps {
  user: User;
  activities: { totalClick: number; title: string; id: number }[];
}

function EmployersDashboard(props: IEmployersDashboardProps) {
  const { user, activities: defaultActivities } = props;
  const [activities, setActivities] = useState(defaultActivities);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [getPng, { ref }] = useCurrentPng();

  useEffect(() => {
    let active = true;

    const timeout = setTimeout(async () => {
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await CompanyService.getJobActivities(
        user!.company!.id,
        params
      );
      if (!active) return;
      setActivities(response.data.activities);
    }, 1000);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [startDate, endDate, user]);

  const clickData = useMemo(() => {
    return activities.map((act, i) => ({
      name: `${act.title} #${i + 1}`,
      amount: act.totalClick,
    }));
  }, [activities]);

  const totalClick = useMemo(() => {
    return clickData.reduce((a, b) => a + b.amount, 0);
  }, [clickData]);

  const handleExport = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, "CTRChart.png");
    }
  }, [getPng]);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageTitle>Dashboard</PageTitle>
      <div className="flex flex-col md:flex-row gap-2 justify-end items-center mb-4">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Typography variant="h6" className="font-bold">
            Showing data from
          </Typography>
          <div className="flex gap-2 items-center">
            <TextField
              containerProps={{ style: { marginBottom: 0 } }}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Typography className="font-bold" variant="h6">
              -
            </Typography>
            <TextField
              containerProps={{ style: { marginBottom: 0 } }}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button onClick={() => handleExport()}>Export</Button>
        </div>
      </div>
      <div className="grid grid-cols-4 mb-4">
        <div className="py-6 border border-neutral-500 rounded-lg text-center">
          <Typography className="font-bold" variant="h4">
            {new Intl.NumberFormat().format(totalClick)}
          </Typography>
          <Typography>Total CTR</Typography>
        </div>
      </div>
      <div className="max-w-3xl">
        <Card className="border-black">
          <CardTitle>CTR Charts</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart ref={ref} data={clickData}>
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
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
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
        () => CompanyService.getJobActivities(user.company.id, {}, context),
        context
      ),
    ]);
    props.activities = res[0].data.activities;
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

EmployersDashboard.getLayout = function getLayout(page: ReactElement) {
  return <EmployersLayout>{page}</EmployersLayout>;
};

export default EmployersDashboard;
