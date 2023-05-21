import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import {
  Button,
  ConfirmationModal,
  Modal,
  MyPopOver,
  TextField,
} from "components/common";
import { PageTitle } from "components/common/dashboard";
import { DataTable } from "components/common/table";
import { JobForm } from "components/employers/job";
import { JobFilter } from "components/jobs";
import { EmployersLayout } from "components/layout";
import { AppContext } from "context/appContext";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { ReactElement, useCallback, useContext, useState } from "react";
import { MoreHorizontal } from "react-feather";
import { AuthService } from "service/auth_service";
import CompanyService from "service/company_service";
import EmploymentTypeService from "service/employment_type_service";
import JobIndustryService from "service/job_industry_service";
import JobSalaryService from "service/job_salary_service";
import JobService from "service/job_service";
import LocationService from "service/location_service";
import {
  EmploymentType,
  Job,
  JobIndustry,
  JobSalary,
  LocationType,
  User,
} from "service/types";
import useAppStore from "store/useAppStore";
import { parseErrorMessage } from "utils/api";
import { dateFormat } from "utils/date";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";

interface IManageListingPageProps {
  user: User;
  jobs: Job[];
  pagination: { totalItems: number; page: string };
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  jobIndustries: JobIndustry[];
  salaries: JobSalary[];
}

function ManageListingPage(props: IManageListingPageProps) {
  const {
    user,
    jobs: defaultJobs,
    employmentTypes,
    locations,
    jobIndustries,
    salaries,
  } = props;
  const [refetch, setRefetch] = useState(false);
  const [status, setStatus] = useState<any>({ val: "", label: "All" });

  const [title, setTitle] = useState("");
  const [sorting, setSorting] = useState<any>({
    val: "created_at",
    label: "Most Recent",
  });
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const [currentJob, setCurrentJob] = useState<Job | undefined>();
  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { setLoading } = useContext(AppContext);

  const wrappedUpdateJobs = useWrapHandleInvalidToken(
    (id: number, payload: any) => JobService.update(id, payload)
  );
  const wrappedPauseJobs = useWrapHandleInvalidToken((id: number) =>
    JobService.pauseJob(id)
  );

  const { categories } = useAppStore();

  const handleDialogClose = async ({ confirmed }: { confirmed: boolean }) => {
    setOpen(false);
    if (confirmed) {
      try {
        setLoading(true);
        const response = await JobService.deleteJob(currentJob!.id);
        showSuccessAlert(response.message);
        setRefetch(!refetch);
      } catch (error) {
        showErrorAlert(parseErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
  };

  const onJobsUpdate = async (payload: any) => {
    try {
      setLoading(true);
      delete payload.salary;
      const response = await wrappedUpdateJobs(currentJob!.id, payload);
      setOpenEditModal(false);
      showSuccessAlert(response.message);
      setRefetch(!refetch);
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onPauseClick = async (job: Job) => {
    try {
      setLoading(true);
      const response = await wrappedPauseJobs(job.id);

      showSuccessAlert(response.message);
      setRefetch(!refetch);
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

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
    columnHelper.display({
      header: () => "Action",
      id: "action",
      cell: (info) => {
        const item = info.row.original;
        return (
          <MyPopOver
            buttonComponent={<MoreHorizontal />}
            className="border-2 border-black"
          >
            <div className="flex flex-col items-center gap-1">
              <Button
                onClick={() => {
                  setCurrentJob(item);
                  setOpenEditModal(true);
                }}
                variant="link"
                block
                className="text-center text-black hover:bg-primary-500 hover:text-white"
              >
                Edit
              </Button>
              {item.status === "open" ? (
                <Button
                  onClick={() => onPauseClick(item)}
                  variant="link"
                  block
                  className="text-center text-black hover:bg-primary-500 hover:text-white"
                >
                  Pause
                </Button>
              ) : null}
              {item.status === "paused" ? (
                <Button
                  onClick={() => onPauseClick(item)}
                  variant="link"
                  block
                  className="text-center text-black hover:bg-primary-500 hover:text-white"
                >
                  Resume
                </Button>
              ) : null}
              {item.status !== "closed" ? (
                <Button
                  variant="link"
                  block
                  className="text-center text-black hover:bg-primary-500 hover:text-white"
                  onClick={() => {
                    setCurrentJob(item);
                    setOpen(true);
                  }}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          </MyPopOver>
        );
      },
    }),
  ];

  const getParams = useCallback(() => {
    const params: any = {};

    if (status) params.status = status.val;
    if (title) params.title = title;
    if (sorting?.val) {
      params.sort_by = sorting.val;
      params.sort_direction = "DESC";
    }

    return params;
  }, [status, title, sorting]);

  const wrappedFetchCompanyJobs = useWrapHandleInvalidToken((params) =>
    CompanyService.getCompanyJobs(user.company!.id, params)
  );

  return (
    <>
      <Head>
        <title>Manage Listing</title>
      </Head>
      <div className="flex md:flex-row flex-col justify-between mb-4">
        <PageTitle>Posted Jobs</PageTitle>
        <div className="flex flex-col md:flex-row gap-x-2">
          <JobFilter
            key={status.label}
            label="Status"
            options={[
              { val: "", label: "All" },
              { val: "pending", label: "Pending" },
              { val: "open", label: "Open" },
              { val: "closed", label: "Closed" },
              { val: "paused", label: "Paused" },
            ]}
            defaultValue={status}
            onChange={(val) => setStatus(val)}
            renderOption={(opt) => opt.label}
            showAction
            getOptionValue={(val) => val?.val}
          />
          <JobFilter
            label="Sort by"
            options={[
              { val: "created_at", label: "Most Recent" },
              { val: "click_counts", label: "Most Relevant" },
            ]}
            defaultValue={sorting}
            onChange={(val) => setSorting(val)}
            renderOption={(opt) => opt.label}
            className="md:w-40 w-full"
            showAction
            getOptionValue={(val) => val?.val}
          />
          <TextField
            rounded
            placeholder="Search job"
            className="py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputSuffix={<span>🔍</span>}
          />
        </div>
      </div>

      <DataTable
        fetchItems={wrappedFetchCompanyJobs}
        columns={columns}
        refetch={refetch}
        getParams={getParams}
        limit={5}
        // defaultValue={defaultJobs}
      />
      <ConfirmationModal onClose={handleDialogClose} open={open} />
      <Modal
        open={openEditModal}
        size="2xl"
        onClose={() => setOpenEditModal(false)}
      >
        <JobForm
          employmentTypes={employmentTypes}
          locations={locations}
          categories={categories}
          onSubmit={onJobsUpdate}
          jobIndustries={jobIndustries}
          salaries={salaries}
          defaultValue={currentJob}
        />
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {
    currentStep: context.query.step || "",
  };
  const res = await Promise.all([
    EmploymentTypeService.gets(),
    LocationService.gets(),
    JobIndustryService.gets(),
    JobSalaryService.gets(),
  ]);
  props.employmentTypes = res[0].data;
  props.locations = res[1].data;
  props.jobIndustries = res[2].data;
  props.salaries = res[3].data;

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

ManageListingPage.getLayout = function getLayout(page: ReactElement) {
  return <EmployersLayout>{page}</EmployersLayout>;
};

export default ManageListingPage;
