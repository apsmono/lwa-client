import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { Button, Typography } from "components/common";
import { PageTitle } from "components/common/dashboard";
import { PaginationButton } from "components/common/pagination";
import { DataTable } from "components/common/table";
import { OrderHistory } from "components/employers/purchase-history";
import { EmployersLayout } from "components/layout";
import { AppContext } from "context/appContext";
import { GetServerSideProps } from "next";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthService } from "service/auth_service";
import CompanyService from "service/company_service";
import { Job, User } from "service/types";
import { handleInvalidTokenServerSide } from "utils/api";
import { dateFormat } from "utils/date";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import { currencyFormat } from "utils/number";

interface IPurchaseHistoryProps {
  user: User;
  jobs: Job[];
  order_summary: { price: number; total: number };
  pagination: { totalItems: number; page: string };
}

function Anaytics(props: IPurchaseHistoryProps) {
  const { user, order_summary, jobs: defaultJobs, pagination } = props;

  const wrappedFetchJobs = useWrapHandleInvalidToken((params) =>
    CompanyService.getCompanyJobs(user.company!.id, params)
  );

  const columnHelper = createColumnHelper<Job>();
  const columns = [
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: () => <span>Job Name</span>,
    }),
    columnHelper.accessor("created_at", {
      cell: (info) => dateFormat(info.getValue()),
      header: () => <span>Posted</span>,
    }),
    columnHelper.accessor("click_counts", {
      cell: (info) => info.getValue(),
      header: () => <span>Click</span>,
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const jobStatus = info.getValue();
        return (
          <span
            className={clsx(
              "inline-block py-1 px-4 text-white rounded-full",
              {
                "bg-info-500": jobStatus === "paused",
              },
              {
                "bg-success-500": jobStatus === "open",
              },
              {
                "bg-danger-500": jobStatus === "closed",
              },
              {
                "bg-warning-500": jobStatus === "pending",
              }
            )}
          >
            {info.getValue()}
          </span>
        );
      },
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor("post_ended_at", {
      cell: (info) => {
        const val = info.getValue();
        if (!val) return "Not specified";
        return dateFormat(val);
      },
      header: () => <span>Closed at</span>,
    }),
  ];

  return (
    <EmployersLayout employers={user} title="Purchase History">
      <PageTitle>Purchase History</PageTitle>

      <div className="flex md:flex-row flex-col gap-4 mb-8">
        <div className="border border-neutral-500 rounded-lg p-6 flex flex-col gap-2 w-full md:w-1/3">
          <Typography>Total Orders</Typography>
          <Typography variant="h2" className="font-bold">
            {Intl.NumberFormat().format(order_summary.total)} Posts
          </Typography>

          <Typography className="font-bold">
            {currencyFormat(order_summary.price)}
          </Typography>
        </div>

        <div className="flex flex-col gap-2">
          <Typography>Need to post more than 10+ jobs?</Typography>
          <Typography>
            Contact us to get our <strong>Bundle</strong> prices 🌈
          </Typography>
          <div className="mt-4">
            <Button size="md" className="min-w-[12rem]">
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      <Typography className="font-bold" variant="h4">
        Orders History
      </Typography>

      <DataTable fetchItems={wrappedFetchJobs} columns={columns} limit={5} />
    </EmployersLayout>
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
        () => CompanyService.getOrderSummary(user.company.id, context),
        context
      ),
      CompanyService.getCompanyJobs(user.company.id, {
        limit: 5,
      }),
    ]);

    props.order_summary = res[0].data;
    props.jobs = res[1].data;
    props.pagination = res[1].page;
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

export default Anaytics;
