import {
  Button,
  ConfirmationModal,
  Modal,
  Select,
  TextField,
  Typography,
} from "components/common";
import { PageTitle } from "components/common/dashboard";
import { JobForm } from "components/employers/job";
import { ListingItem } from "components/employers/listing";
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
import { ChevronRight } from "react-feather";
import { AuthService } from "service/auth_service";
import CompanyService from "service/company_service";
import EmploymentTypeService from "service/employment_type_service";
import JobService from "service/job_service";
import LocationService from "service/location_service";
import { EmploymentType, Job, LocationType, User } from "service/types";
import useAppStore from "store/useAppStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";

interface IManageListingPageProps {
  user: User;
  jobs: Job[];
  pagination: { totalItems: number; page: string };
  locations: LocationType[];
  employmentTypes: EmploymentType[];
}

function ManageListingPage(props: IManageListingPageProps) {
  const {
    user,
    jobs: defaultJobs,
    pagination,
    employmentTypes,
    locations,
  } = props;
  const [refetch, setRefetch] = useState(false);
  const [status, setStatus] = useState<any>({ val: "", label: "All" });
  const [jobs, setJobs] = useState(defaultJobs);
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

  const [pageData, setPageData] = useState({
    totalItems: pagination.totalItems,
    page: pagination.page,
  });

  const { categories } = useAppStore();

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
      if (status) params.status = status.val;
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
  }, [title, pageData.page, totalPages, sorting, status]);

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
  }, [fetchData, refetch]);

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

  return (
    <>
      <EmployersLayout title="Manage Listing" employers={user}>
        <PageTitle>Posted Jobs</PageTitle>
        <div className="flex flex-col md:flex-row gap-y-2 justify-between items-center mb-3">
          <Select
            label="Sort by"
            rounded={false}
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
            className="md:w-40 w-full"
          />

          <div className="flex flex-col md:flex-row gap-x-2 items-end">
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
              defaultValue={sorting}
              onChange={(val) => setSorting(val)}
              renderOption={(opt) => opt.label}
              className="md:w-40 w-full"
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
            <ListingItem
              onDeleteClick={() => {
                setCurrentJob(job);
                setOpen(true);
              }}
              onEditClick={() => {
                setCurrentJob(job);
                setOpenEditModal(true);
              }}
              key={job.id}
              job={job as Job}
              onPauseClick={() => {
                onPauseClick(job);
              }}
            />
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
  ]);
  props.employmentTypes = res[0].data;
  props.locations = res[1].data;

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
