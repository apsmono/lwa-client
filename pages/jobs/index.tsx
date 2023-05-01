import { Button, Chip, TextField, Typography } from "components/common";
import AdvanceSelect, {
  TAdvanceSelectRef,
} from "components/common/forms/AdvanceSelect";
import { Subscribe } from "components/home";
import JobCard from "components/home/job/JobCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CategoryService from "service/category_service";
import EmploymentTypeService from "service/employment_type_service";
import JobService from "service/job_service";
import LocationService from "service/location_service";
import { Category, EmploymentType, Job, LocationType } from "service/types";
import useAppStore from "store/useAppStore";

interface JobListPageProps {
  jobs: Job[];
  category?: Category;
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  jobTitle?: string;
}

function JobListPage(props: JobListPageProps) {
  const {
    category,
    jobs,
    employmentTypes,
    locations,
    jobTitle: userJobTitle,
  } = props;
  const router = useRouter();
  const { categories } = useAppStore();
  const [employmentType, setEmploymentType] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any>(null);
  const [datePosted, setDatePosted] = useState<any>(null);
  const [jobList, setJobList] = useState(jobs);
  const [salary, setSalary] = useState<any>(null);
  const [jobTitle, setJobTitle] = useState(userJobTitle);
  const salaries = useMemo(() => {
    return [
      {
        label: "<$50k",
        start: 0,
        end: 50000,
      },
      { label: "$50k - $80k", start: 50000, end: 80000 },
      {
        label: "$80k - $100k",
        start: 80000,
        end: 100000,
      },
      {
        label: "$100k - $150k",
        start: 100000,
        end: 150000,
      },
      {
        label: "$150k - $180k",
        start: 150000,
        end: 180000,
      },
      { label: "$180k - $200k", start: 180000, end: 200000 },
      { label: ">$200k", start: 200000 },
    ];
  }, []);
  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  useEffect(() => {
    setJobList(jobs);
  }, [jobs]);

  const title = useMemo(() => {
    if (!category) return "Jobs";
    return `Jobs - ${category.name}`;
  }, [category]);

  const fetchJobs = useCallback(async () => {
    const params: any = {
      status: "open",
    };
    const categoryIds = [];
    if (employmentType.length) {
      params.employment_type_id = employmentType.map((l) => l.id);
    }
    if (location.length) params.location_id = location.map((l) => l.id);
    if (categoriesList.length)
      categoriesList.forEach((c) => categoryIds.push(c.id));
    if (category) {
      categoryIds.push(category.id);
    }
    if (sorting?.val) {
      params.sort_by = sorting.val;
      params.sort_direction = "DESC";
    }
    if (jobTitle) params.title = jobTitle;
    if (datePosted?.val) {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setDate(startDate.getDate() - datePosted.val);
      params.start_date = startDate.toLocaleDateString();
      params.end_date = endDate.toLocaleDateString();
    }
    if (salary) {
      if (salary.start) params.start_salary = salary.start;
      if (salary.end) params.end_salary = salary.end;
    }
    if (categoryIds.length) params.category_id = categoryIds.map((c) => c);

    const response = await JobService.gets(params);
    return response.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    employmentType,
    category,
    location,
    jobTitle,
    sorting,
    datePosted,
    categoriesList,
    salary,
  ]);

  useEffect(() => {
    (async () => {
      const res = await fetchJobs();
      setJobList(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employmentType, location, sorting, datePosted, categoriesList, salary]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetchJobs();
    setJobList(res);
  };

  const employmentTypeRef = useRef<TAdvanceSelectRef>(null);
  const locationRef = useRef<TAdvanceSelectRef>(null);
  const categoriesListRef = useRef<TAdvanceSelectRef>(null);
  const salaryListRef = useRef<TAdvanceSelectRef>(null);
  const datePostedRef = useRef<TAdvanceSelectRef>(null);
  const sortingRef = useRef<TAdvanceSelectRef>(null);
  const handleResetClick = () => {
    employmentTypeRef.current?.removeValue();
    locationRef.current?.removeValue();
    categoriesListRef.current?.removeValue();
    salaryListRef.current?.removeValue();
    datePostedRef.current?.removeValue();
    sortingRef.current?.removeValue();
    setDatePosted(null);
    setSorting(null);
  };

  return (
    <GuestLayout
      title={title}
      bottomComponent={
        <Subscribe className="max-w-7xl mx-auto" categories={categories} />
      }
    >
      <div className="max-w-5xl p-6 mx-auto flex flex-col gap-2 min-h-[70vh]">
        {category ? (
          <>
            <h1 className="font-black text-center font-palo uppercase text-7xl mb-3">
              {category.name} Jobs
            </h1>
            <Typography className="text-center">
              {category.description}
            </Typography>
          </>
        ) : (
          <h1 className="font-black text-center font-palo uppercase text-7xl mb-3">
            Jobs
          </h1>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Search Job"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </form>
        <div className="flex gap-x-4 flex-wrap items-center">
          <AdvanceSelect
            ref={sortingRef}
            label="Sort by"
            options={[
              { val: "created_at", label: "Most Recent" },
              { val: "click_counts", label: "Most Relevant" },
            ]}
            className="md:w-auto min-w-[12rem]"
            showAction
            renderOption={(val) => val?.label}
            onChange={(val) => setSorting(val)}
            getOptionValue={(val) => val?.val}
          />
          <AdvanceSelect
            ref={datePostedRef}
            label="Date posted"
            options={[
              { val: "", label: "Anytime" },
              { val: 7, label: "Past week" },
              { val: 1, label: "Past 24 hours" },
              { val: 30, label: "Past month" },
            ]}
            className="md:w-auto min-w-[12rem]"
            showAction
            renderOption={(val) => val.label}
            onChange={(val) => setDatePosted(val)}
            getOptionValue={(val) => val?.val}
          />
          <AdvanceSelect
            label="Job Type"
            options={employmentTypes}
            renderOption={(val) => val?.name}
            multiple
            onChange={(val) => setEmploymentType(val)}
            getOptionValue={(val) => val?.id}
            ref={employmentTypeRef}
            className="md:w-auto min-w-[12rem]"
            showAction
          />
          <AdvanceSelect
            className="md:w-auto min-w-[12rem]"
            showAction
            multiple
            label="Locations"
            options={[...locations]}
            renderOption={(val) => val?.name}
            onChange={(val) => setLocation(val)}
            getOptionValue={(val) => val?.id}
            ref={locationRef}
          />
          <AdvanceSelect
            className="md:w-auto min-w-[12rem]"
            showAction
            multiple
            label="Category"
            options={[...categories]}
            renderOption={(val) => val?.name}
            ref={categoriesListRef}
            onChange={(val) => setCategoriesList(val)}
            getOptionValue={(val) => val?.id}
          />
          <AdvanceSelect
            className="md:w-auto min-w-[12rem]"
            showAction
            label="Salary"
            options={salaries}
            renderOption={(opt) => opt.label}
            ref={salaryListRef}
            getOptionValue={(val) => val?.id}
            onChange={(val) => setSalary(val)}
          />
          <div className="mb-3">
            <Button
              variant="white"
              size="sm"
              className="px-2"
              onClick={handleResetClick}
            >
              Reset
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap w-full">
            {employmentType.map((et, i) => (
              <Chip
                key={et.id}
                onClose={() => {
                  employmentTypeRef.current!.removeValue(i);
                }}
              >
                <Typography variant="small">{et.name}</Typography>
              </Chip>
            ))}
            {location.map((l, i) => (
              <Chip
                key={l.id}
                onClose={() => {
                  locationRef.current!.removeValue(i);
                }}
              >
                <Typography variant="small">{l.name}</Typography>
              </Chip>
            ))}
            {categoriesList.map((l, i) => (
              <Chip
                key={l.id}
                onClose={() => {
                  categoriesListRef.current!.removeValue(i);
                }}
              >
                <Typography variant="small">{l.name}</Typography>
              </Chip>
            ))}
          </div>
        </div>
        <Typography variant="small" className="text-center mt-4">
          &quot;{new Intl.NumberFormat().format(jobList.length)}&quot; Jobs
          Available
        </Typography>
        {jobList.map((job) => (
          <div className="mb-2" key={job.id}>
            <JobCard onClick={() => handleClick(job)} job={job} />
          </div>
        ))}
      </div>
    </GuestLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: any = {};
  const { category_id, title } = context.query;
  const jobParams: any = {
    status: "open",
  };

  if (title) {
    props.title = title;
    jobParams.title = title;
  }

  if (category_id) {
    const category = await (
      await CategoryService.get(+category_id)
    ).data.category;
    jobParams.category_id = category_id;
    props.category = category;
  }

  const res = await Promise.all([
    JobService.gets(jobParams),
    EmploymentTypeService.gets(),
    LocationService.gets(),
  ]);
  props.jobs = res[0].data;
  props.employmentTypes = res[1].data;
  props.locations = res[2].data;
  if (title) props.jobTitle = title;

  return {
    props,
  };
};

export default JobListPage;
