import { Button, Select, TextField, Typography } from "components/common";
import { PageTitle } from "components/common/dashboard";
import { ListingItem } from "components/employers/listing";
import { EmployersLayout } from "components/layout";
import { GetServerSideProps } from "next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight } from "react-feather";
import { AuthService } from "service/auth_service";
import CategoryService from "service/category_service";
import CompanyService from "service/company_service";
import { Category, Job, User } from "service/types";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";

interface IManageListingPageProps {
  categories: Category[];
  user: User;
  jobs: Job[];
  pagination: { totalItems: number; page: string };
}

function ManageListingPage(props: IManageListingPageProps) {
  const { categories, user, jobs: defaultJobs, pagination } = props;
  const [status, setStatus] = useState("open");
  const [jobs, setJobs] = useState(defaultJobs);
  const [title, setTitle] = useState("");
  const [sorting, setSorting] = useState<any>(null);
  const { showErrorAlert } = useAlert();

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
      if (title) params.title = title;
      if (sorting?.val) {
        params.sort_by = sorting.val;
        params.sort_direction = "DESC";
      }
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
  }, [title, pageData.page, totalPages, sorting]);

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
  }, [title, pageData.page, sorting]);
  return (
    <EmployersLayout
      categories={categories}
      title="Manage Listing"
      employers={user}
    >
      <PageTitle>Posted Jobs</PageTitle>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-4">
          <div>
            <Button
              rounded={false}
              onClick={() => setStatus("open")}
              variant={status === "open" ? "secondary" : "white"}
            >
              Open
            </Button>
          </div>
          <div>
            <Button
              onClick={() => setStatus("closed")}
              rounded={false}
              variant={status === "closed" ? "secondary" : "white"}
            >
              Closed
            </Button>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <TextField
            rounded={false}
            placeholder="Search job"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            label="Sort by"
            rounded={false}
            options={[
              { val: "created_at", label: "Most Recent" },
              { val: "click_counts", label: "Most Relevant" },
            ]}
            onChange={(val) => setSorting(val)}
            renderOption={(opt) => opt.label}
            className="w-40"
          />
        </div>
      </div>

      <div className="border-2 p-4 rounded-lg border-black flex flex-col gap-4">
        {!jobs.length ? (
          <Typography className="text-center font-bold">
            No data available
          </Typography>
        ) : null}
        {jobs.map((job) => (
          <ListingItem key={job.id} job={job as Job} />
        ))}
      </div>

      <div className="flex justify-center items-center mt-4 gap-4">
        <TextField
          containerProps={{ className: "mb-0" }}
          className="w-24"
          rounded={false}
          value={pageData.page}
          onChange={(e) =>
            setPageData({
              ...pageData,
              page: e.target.value,
            })
          }
          type="number"
        />{" "}
        <Typography>/ {totalPages}</Typography>
        <button
          disabled={+pageData.page >= totalPages}
          onClick={() =>
            setPageData({
              ...pageData,
              page: (+pageData.page + 1).toString(),
            })
          }
        >
          <ChevronRight />
        </button>
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
    const user = (await AuthService.fetchMe(context)).data?.user || null;

    props.user = user;

    const response = await CompanyService.getCompanyJobs(user.company.id, {
      limit: 5,
    });
    const { data, page } = response;
    props.jobs = data;
    props.pagination = page;
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

export default ManageListingPage;
