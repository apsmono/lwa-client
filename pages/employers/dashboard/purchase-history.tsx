import { Button, Typography } from "components/common";
import { PageTitle } from "components/common/dashboard";
import { PaginationButton } from "components/common/pagination";
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
import { handleInvalidTokenServerSide, parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import { currencyFormat } from "utils/number";

interface IPurchaseHistoryProps {
  user: User;
  jobs: Job[];
  order_summary: { price: number; total: number };
  pagination: { totalItems: number; page: string };
}

function Anaytics(props: IPurchaseHistoryProps) {
  const { user, order_summary, jobs: defaultJobs, pagination } = props;

  const [jobs, setJobs] = useState(defaultJobs);
  const { setLoading } = useContext(AppContext);
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const [pageData, setPageData] = useState({
    totalItems: pagination.totalItems,
    page: pagination.page,
  });

  const totalPages = useMemo(
    () => Math.ceil((pageData?.totalItems || 1) / 5),
    [pageData?.totalItems]
  );

  const fetchData = useCallback(async () => {
    try {
      const params: any = {
        limit: 5,
        offset: pageData.page,
      };
      if ((+pageData.page || 0) <= 0 || +pageData.page > totalPages)
        throw new Error("Page is invalid");
      const response = await CompanyService.getCompanyJobs(
        user.company!.id,
        params
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        showErrorAlert(error.message);
      } else {
        showErrorAlert(parseErrorMessage(error));
      }
      return { data: [], page: { page: 1, totalItems: 1 } };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData.page, totalPages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      (async () => {
        const response = await fetchData();
        setJobs(response.data as Job[]);
        setPageData({
          ...pageData,
          totalItems: response.page.totalItems as number,
        });
      })();
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData.page]);

  return (
    <EmployersLayout employers={user} title="Purchase History">
      <PageTitle>Purchase History</PageTitle>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="bg-secondary-300 border border-black rounded-lg p-6 flex flex-col gap-2">
          <Typography>Total Orders</Typography>
          <Typography variant="h3" className="font-bold">
            {Intl.NumberFormat().format(order_summary.total)} Posts
          </Typography>

          <Typography className="font-bold">
            {currencyFormat(order_summary.price)}
          </Typography>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <Typography>Need to post more than 10+ jobs?</Typography>
          <Typography>
            Contact us to get our <strong>Bundle</strong> prices 🌈
          </Typography>
          <div>
            <Button variant="white">Contact Us</Button>
          </div>
        </div>
      </div>

      <div className="border-2 p-4 rounded-lg border-black flex flex-col gap-4 mt-6">
        {!jobs.length ? (
          <Typography className="text-center font-bold">
            No data available
          </Typography>
        ) : null}
        {jobs.map((job) => (
          <OrderHistory key={job.id} job={job as Job} />
        ))}
      </div>
      <PaginationButton
        onChange={(val) => {
          setPageData({
            ...pageData,
            page: val,
          });
        }}
        pageData={pagination}
        totalPages={totalPages}
      />
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
