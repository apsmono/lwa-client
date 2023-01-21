import { Select, TextField, Typography } from "components/common";
import JobCard from "components/home/job/JobCard";
import { GuestLayout } from "components/layout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CategoryService from "service/category_service";
import EmploymentTypeService from "service/employment_type_service";
import JobService from "service/job_service";
import LanguageService from "service/languages_service";
import LocationService from "service/location_service";
import {
  Category,
  EmploymentType,
  Job,
  LanguageType,
  LocationType,
} from "service/types";

interface JobListPageProps {
  jobs: Job[];
  category?: Category;
  categories: Category[];
  languages: LanguageType[];
  locations: LocationType[];
  employmentTypes: EmploymentType[];
  jobTitle?: string;
}

function JobListPage(props: JobListPageProps) {
  const {
    categories,
    category,
    jobs,
    employmentTypes,
    languages,
    locations,
    jobTitle: userJobTitle,
  } = props;
  const router = useRouter();
  const [employmentTypeId, setEmploymentTypeId] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [languageId, setLanguageId] = useState(null);
  const [jobList, setJobList] = useState(jobs);
  const [jobTitle, setJobTitle] = useState(userJobTitle);
  const handleClick = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const title = useMemo(() => {
    if (!category) return "Jobs";
    return `Jobs - ${category.name}`;
  }, [category]);

  const fetchJobs = useCallback(async () => {
    const params: any = {};
    if (employmentTypeId) {
      params.employment_type_id = employmentTypeId;
    }
    if (locationId) params.location_id = locationId;
    if (languageId) params.language_id = languageId;
    if (category) {
      params.category_id = category.id;
    }
    if (jobTitle) params.title = jobTitle;

    const response = await JobService.gets(params);
    return response.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employmentTypeId, category, locationId, languageId, jobTitle]);

  useEffect(() => {
    (async () => {
      const res = await fetchJobs();
      setJobList(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employmentTypeId, locationId, languageId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetchJobs();
    setJobList(res);
  };

  return (
    <GuestLayout title={title} categories={categories}>
      <div className="max-w-5xl p-6 mx-auto flex flex-col gap-2 min-h-[70vh]">
        {category ? (
          <>
            <Typography variant="h1" className="font-bold text-center">
              {category.name} Job
            </Typography>
            <Typography className="text-center">
              {category.description}
            </Typography>
          </>
        ) : null}
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Search Job"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </form>
        <div className="flex gap-4 flex-wrap">
          <Select
            options={[
              { text: "Job Type", value: "" },
              ...employmentTypes.map((et) => ({
                text: et.name,
                value: et.id,
              })),
            ]}
            onChange={(val) => {
              setEmploymentTypeId(val);
            }}
          />
          <Select
            options={[
              { text: "Location", value: "" },
              ...locations.map((l) => ({
                text: l.name,
                value: l.id,
              })),
            ]}
            onChange={(val) => setLocationId(val)}
          />
          <Select
            options={[
              { text: "Language", value: "" },
              ...languages.map((l) => ({
                text: l.name,
                value: l.id,
              })),
            ]}
            onChange={(val) => setLanguageId(val)}
          />
        </div>
        <Typography variant="small" className="text-center">
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
  const jobParams: any = {};

  if (category_id) {
    const category = await (
      await CategoryService.get(+category_id)
    ).data.category;
    jobParams.category_id = category_id;
    props.category = category;
  }
  if (title) props.title = title;

  const res = await Promise.all([
    JobService.gets(jobParams),
    CategoryService.gets(),
    LanguageService.gets(),
    EmploymentTypeService.gets(),
    LocationService.gets(),
  ]);
  props.jobs = res[0].data;
  props.categories = res[1].data;
  props.languages = res[2].data;
  props.employmentTypes = res[3].data;
  props.locations = res[4].data;
  props.jobTitle = title;

  return {
    props,
  };
};

export default JobListPage;
