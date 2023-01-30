import { Chip, Select, TextField, Typography } from "components/common";
import { SelectRefType } from "components/common/forms/Select";
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
  const [employmentType, setEmploymentType] = useState<any[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const [language, setLanguage] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any>(null);
  const [datePosted, setDatePosted] = useState<any>(null);
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
    const categoryIds = [];
    if (employmentType.length) {
      params.employment_type_id = employmentType.map((l) => l.id);
    }
    if (location.length) params.location_id = location.map((l) => l.id);
    if (language.length) params.language_id = language.map((l) => l.id);
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
    if (categoryIds.length) params.category_id = categoryIds.map((c) => c);

    const response = await JobService.gets(params);
    return response.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    employmentType,
    category,
    location,
    language,
    jobTitle,
    sorting,
    datePosted,
    categoriesList,
  ]);

  useEffect(() => {
    (async () => {
      const res = await fetchJobs();
      setJobList(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employmentType, location, language, sorting, datePosted, categoriesList]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetchJobs();
    setJobList(res);
  };

  const employmentTypeRef = useRef<SelectRefType>(null);
  const locationRef = useRef<SelectRefType>(null);
  const languageRef = useRef<SelectRefType>(null);
  const categoriesListRef = useRef<SelectRefType>(null);

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
            placeholder="Sort by"
            options={[
              { val: "created_at", label: "Most Recent" },
              { val: "click_counts", label: "Most Relevant" },
            ]}
            renderOption={(val) => val?.label}
            onChange={(val) => setSorting(val)}
            className="sm:w-36 w-full"
          />
          <Select
            placeholder="Date posted"
            options={[
              { val: "", label: "Anytime" },
              { val: 7, label: "Past week" },
              { val: 1, label: "Past 24 hours" },
              { val: 30, label: "Past month" },
            ]}
            renderOption={(val) => val.label}
            className="sm:w-36 w-full"
            onChange={(val) => setDatePosted(val)}
          />
          <Select
            multiple
            placeholder="Job Type"
            options={[...employmentTypes]}
            renderOption={(val) => val?.name}
            onChange={(val) => setEmploymentType(val)}
            className="sm:w-36 w-full"
            ref={employmentTypeRef}
          />
          <Select
            multiple
            placeholder="Locations"
            options={[...locations]}
            renderOption={(val) => val?.name}
            onChange={(val) => setLocation(val)}
            className="sm:w-36 w-full"
            ref={locationRef}
          />
          <Select
            multiple
            placeholder="Category"
            options={[...categories]}
            renderOption={(val) => val?.name}
            className="sm:w-36 w-full"
            ref={categoriesListRef}
            onChange={(val) => setCategoriesList(val)}
          />
          <Select
            multiple
            placeholder="Languages"
            options={[...languages]}
            renderOption={(val) => val?.name}
            onChange={(val) => setLanguage(val)}
            className="sm:w-36 w-full"
            ref={languageRef}
          />
          <div className="flex gap-2 flex-wrap">
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
            {language.map((l, i) => (
              <Chip
                key={l.id}
                onClose={() => {
                  languageRef.current!.removeValue(i);
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
  if (title) props.jobTitle = title;

  return {
    props,
  };
};

export default JobListPage;
