import {
  Button,
  Chip,
  PageTitle,
  TextField,
  Typography,
} from "components/common";
import { TAdvanceSelectRef } from "components/common/forms/AdvanceSelect";
import { Subscribe } from "components/home";
import JobCard from "components/home/job/JobCard";
import { JobFilter } from "components/jobs";
import { GetServerSideProps } from "next";
import Head from "next/head";
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
import CompanySizeService from "service/company_size_service";
import EmploymentTypeService from "service/employment_type_service";
import JobIndustryService from "service/job_industry_service";
import JobSalaryService from "service/job_salary_service";
import JobService from "service/job_service";
import LocationService from "service/location_service";
import {
  Category,
  EmploymentType,
  Job,
  JobIndustry,
  JobSalary,
  LocationType,
} from "service/types";
import { CompanySize } from "service/types/company_type";
import useAppStore from "store/useAppStore";

interface JobListPageProps {
  jobs: Job[];
  category?: Category;
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  jobTitle?: string;
  jobIndustries: JobIndustry[];
  companySizes: CompanySize[];
  salaries: JobSalary[];
}

function JobListPage(props: JobListPageProps) {
  const {
    category,
    jobs,
    employmentTypes,
    locations,
    jobTitle: userJobTitle,
    jobIndustries = [],
    companySizes = [],
    salaries = [],
  } = props;
  const router = useRouter();
  const { categories } = useAppStore();
  const [employmentType, setEmploymentType] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any>(null);
  const [datePosted, setDatePosted] = useState<any>(null);
  const [jobList, setJobList] = useState(jobs);
  const [salary, setSalary] = useState<JobSalary[]>();
  const [jobTitle, setJobTitle] = useState(userJobTitle);
  const [cpSize, setCpSize] = useState<CompanySize[]>();
  const [selectedIndustries, setSelectedIndustries] = useState<JobIndustry[]>();

  const industries = useMemo(() => {
    const copy = [...jobIndustries];
    const other = copy.filter((c) => c.name === "Other")[0];
    const copyWithoutOther = copy.filter((c) => c.name !== "Other");
    if (other) copyWithoutOther.push(other);
    return copyWithoutOther;
  }, [jobIndustries]);
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
    if (cpSize) {
      if (cpSize.length) params.company_size_id = cpSize.map((cp) => cp.id);
    }
    if (selectedIndustries) {
      if (selectedIndustries.length) {
        params.job_industry_id = selectedIndustries.map((i) => i.id);
      }
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
      if (salary.length) params.job_salary_id = salary.map((s) => s.id);
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
    cpSize,
    selectedIndustries,
  ]);

  useEffect(() => {
    (async () => {
      const res = await fetchJobs();
      setJobList(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchJobs]);

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
  const cpSizeRef = useRef<TAdvanceSelectRef>(null);
  const jobIndustryRef = useRef<TAdvanceSelectRef>(null);

  const handleResetClick = () => {
    employmentTypeRef.current?.removeValue();
    locationRef.current?.removeValue();
    categoriesListRef.current?.removeValue();
    salaryListRef.current?.removeValue();
    datePostedRef.current?.removeValue();
    sortingRef.current?.removeValue();
    cpSizeRef.current?.removeValue();
    jobIndustryRef.current?.removeValue();
    setDatePosted(null);
    setSorting(null);
  };

  return (
    <>
      <Head>
        <title>
          {category ? `Remote Jobs - ${category.name}` : "Remote Jobs"}
        </title>
      </Head>
      <div className="max-w-5xl p-6 mx-auto flex flex-col gap-2 min-h-[70vh]">
        <div className="flex flex-col gap-2">
          {category ? (
            <>
              <PageTitle className="text-center mb-4">
                {category.name}
              </PageTitle>
              <Typography className="text-center mb-4">
                {category.description}
              </Typography>
            </>
          ) : (
            <PageTitle className="text-center mb-4">Jobs</PageTitle>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Search keyword, e.g. Location, Full-Time, Programmer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </form>
        </div>
        <div className="flex gap-x-4 flex-wrap items-center">
          <JobFilter
            ref={sortingRef}
            label="🌶️ Sort By"
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
          <JobFilter
            ref={datePostedRef}
            label="🗓️ Date Posted"
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
          <JobFilter
            label="💻 Job Type"
            options={employmentTypes}
            renderOption={(val) => val?.name}
            multiple
            onChange={(val) => setEmploymentType(val)}
            getOptionValue={(val) => val?.id}
            ref={employmentTypeRef}
            className="md:w-auto min-w-[12rem]"
            showAction
          />
          <JobFilter
            className="md:w-auto min-w-[12rem]"
            showAction
            multiple
            label="🌎 Location"
            options={[...locations]}
            renderOption={(val) => val?.name}
            onChange={(val) => setLocation(val)}
            getOptionValue={(val) => val?.id}
            ref={locationRef}
          />
          <JobFilter
            className="md:w-auto min-w-[12rem] max-h-[250px] overflow-y-auto"
            showAction
            multiple
            label="🏢 Industry"
            options={industries}
            renderOption={(val) => val?.name}
            onChange={(val) => setSelectedIndustries(val)}
            getOptionValue={(val) => val?.id}
            ref={jobIndustryRef}
          />
          <JobFilter
            className="md:w-auto min-w-[12rem]"
            showAction
            multiple
            label="🤩 Company Size"
            options={companySizes}
            renderOption={(val) => val?.size}
            onChange={(val) => setCpSize(val)}
            getOptionValue={(val) => val?.id}
            ref={cpSizeRef}
          />
          <JobFilter
            className="md:w-auto min-w-[12rem] max-h-[250px] overflow-y-auto"
            showAction
            multiple
            label="💼 Category"
            options={[...categories]}
            renderOption={(val) => val?.name}
            ref={categoriesListRef}
            onChange={(val) => setCategoriesList(val)}
            getOptionValue={(val) => val?.id}
          />
          <JobFilter
            className="md:w-auto min-w-[12rem]"
            showAction
            multiple
            label="🔥 Salary"
            options={salaries}
            renderOption={(opt) => opt.salary}
            ref={salaryListRef}
            getOptionValue={(val) => val?.id}
            onChange={(val) => setSalary(val)}
          />
          <div className="mb-3">
            <Button
              filled={false}
              className="bg-primary-800 hover:bg-primary-900 text-white"
              size="sm"
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
            {selectedIndustries
              ? selectedIndustries.map((si, i) => (
                  <Chip
                    key={si.id}
                    onClose={() => {
                      jobIndustryRef.current!.removeValue(i);
                    }}
                  >
                    <Typography variant="small">{si.name}</Typography>
                  </Chip>
                ))
              : null}
            {cpSize
              ? cpSize.map((cp, i) => (
                  <Chip
                    key={cp.id}
                    onClose={() => {
                      cpSizeRef.current!.removeValue(i);
                    }}
                  >
                    <Typography variant="small">{cp.size}</Typography>
                  </Chip>
                ))
              : null}
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
      <div className="pt-12 px-6">
        <Subscribe className="max-w-7xl mx-auto" categories={categories} />
      </div>
    </>
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
    JobIndustryService.gets(),
    CompanySizeService.gets(),
    JobSalaryService.gets(),
  ]);
  props.jobs = res[0].data;
  props.employmentTypes = res[1].data;
  props.locations = res[2].data;
  props.jobIndustries = res[3].data;
  props.companySizes = res[4].data;
  props.salaries = res[5].data;
  if (title) props.jobTitle = title;

  return {
    props,
  };
};

export default JobListPage;
