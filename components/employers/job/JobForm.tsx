import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import {
  Button,
  InputLabel,
  Select,
  TextAreaField,
  TextField,
} from "components/common";
import { Radio } from "components/common/forms";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  Category,
  EmploymentType,
  Job,
  JobIndustry,
  JobSalary,
  LanguageType,
  LocationType,
} from "service/types";
import {
  getFormAttribute,
  getFormAttributeAdmin,
  purgeInitialFormData,
} from "utils/form";
import { BASE_BLANK_FORM, schema } from "./constants";
import useAuthStore from "store/useAuthStore";

interface JobFormProps {
  categories: Category[];
  languages: LanguageType[];
  employmentTypes: EmploymentType[];
  locations: LocationType[];
  defaultValue: Partial<Job>;
  className: string;
  onSubmit?: (val: any) => void;
  showSubmit: boolean;
  jobIndustries: JobIndustry[];
  salaries: JobSalary[];
}

export interface JobFormRef {
  getValues: () => Partial<Job>;
  submitForm: () => Promise<any>;
}

const JobForm = forwardRef<JobFormRef, Partial<JobFormProps>>((props, ref) => {
  const {
    categories = [],
    employmentTypes = [],
    locations = [],
    defaultValue = {},
    className,
    onSubmit = (val) => console.log(val),
    showSubmit = true,
    jobIndustries = [],
    salaries,
  } = props;

  const { user } = useAuthStore();
  const isAdmin = user?.email === "contact@letsworkanywhere.com";
  // console.log("isAdmin", isAdmin);

  const [initialValue] = useState(() =>
    purgeInitialFormData(defaultValue, BASE_BLANK_FORM)
  );

  const [isWorldwide, setIsWordwide] = useState<boolean>(
    initialValue?.is_worldwide || undefined
  );

  const [selectedCategory, setSelectedCategory] = useState<Category>(() => {
    return categories.filter((item) => item.id === defaultValue.category_id)[0];
  });
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<EmploymentType>(() => {
      return employmentTypes.filter(
        (item) => item.id === defaultValue.employment_type_id
      )[0];
    });
  const [selectedJobIndustry, setSelectedJobIndustry] = useState<JobIndustry>(
    () => {
      return jobIndustries.filter(
        (item) => item.id === defaultValue.job_industry_id
      )[0];
    }
  );
  const [selectedSalary, setSelectedSalary] = useState<JobSalary>(() => {
    return (salaries || []).filter(
      (item) => item.id === defaultValue.job_salary_id
    )[0];
  });
  const [selectedLocation, setSelectedLocation] = useState<LocationType>();

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });

  const getFieldAttribute = (
    label: string,
    name: string,
    id: string,
    placeholder?: string
  ) => {
    if (isAdmin)
      return {
        ...getFormAttributeAdmin(label, name, id, register, initialValue),
        placeholder,
      };

    return {
      ...getFormAttribute(label, name, id, register, errors, initialValue),
      placeholder,
    };
  };

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => {
        const job: Partial<Job> = {
          ...getValues(),
          is_worldwide: isWorldwide,
          category_name: selectedCategory?.name || "",
          location: isWorldwide ? "Worldwide" : selectedLocation?.name || "",
          employment_type: selectedEmploymentType?.name || "",
          industry_name: selectedJobIndustry?.name || "",
          salary: selectedSalary.salary,
        };
        if (job.is_worldwide) {
          job.location_id = 1;
        }
        return job;
      },
      submitForm: () => new Promise((res, rej) => handleSubmit(res, rej)()),
    }),
    [
      isWorldwide,
      getValues,
      handleSubmit,
      selectedCategory?.name,
      selectedEmploymentType?.name,
      selectedLocation?.name,
      selectedJobIndustry,
      selectedSalary,
    ]
  );

  const submitForm = (val: any) => {
    delete val.language_id;
    delete val.timezone;
    if (!val.location_id) delete val.location_id;
    onSubmit(val);
  };

  useEffect(() => {
    console.log(initialValue);
  }, [initialValue]);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className={clsx(className)}>
        <TextField
          {...getFieldAttribute(
            isAdmin ? "How to apply(optional)" : "How to apply*",
            "apply_link",
            "apply_link",
            "Type here"
          )}
          labelAppend="Required fields*"
          labelDescription="Link to application page"
        />

        <TextField
          {...getFieldAttribute(
            isAdmin ? "Job Title(optional)" : "Job Title*",
            "title",
            "title",
            "E.g. Project Manager, Senior Analyst"
          )}
        />

        <Select
          options={categories}
          renderOption={(opt) => opt.name}
          {...getFieldAttribute(
            isAdmin ? "Category(optional)" : "Category*",
            "category_id",
            "category_id"
          )}
          defaultValue={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
          getInputValue={(val: any) => val?.id || ""}
          setFormValue={setValue}
        />

        <Select
          options={jobIndustries}
          renderOption={(opt) => opt.name}
          {...getFieldAttribute(
            "Job Industry",
            "job_industry_id",
            "job_industry_id"
          )}
          getInputValue={(val: any) => val?.id || ""}
          setFormValue={setValue}
          defaultValue={selectedJobIndustry}
          onChange={(val) => setSelectedJobIndustry(val)}
        />

        <Select
          options={employmentTypes}
          renderOption={(opt) => opt.name}
          {...getFieldAttribute(
            isAdmin ? "Employment Type(optional)" : "Employment Type*",
            "employment_type_id",
            "employment_type_id"
          )}
          getInputValue={(val: any) => val?.id || ""}
          setFormValue={setValue}
          defaultValue={selectedEmploymentType}
          onChange={(val) => setSelectedEmploymentType(val)}
        />

        <InputLabel description="Selecting ‘Yes’ means your future hire can work anywhere in the world without any location or time zone restrictions.">
          {`Is this role open worldwide ${isAdmin ? "" : "*"}`}
        </InputLabel>

        <Radio
          error={!!errors.is_worldwide}
          helperText={errors.is_worldwide?.message}
          register={register}
          name="is_worldwide"
          id="is_worldwide"
          variant="black"
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          radioSize="md"
          value={isWorldwide}
          onChange={(val) => setIsWordwide(val)}
        />

        {isWorldwide === false ? (
          <Select
            options={locations.filter((l) => l.id !== 1)}
            renderOption={(opt) => opt.name}
            {...getFieldAttribute(
              isAdmin ? "Region(optional)" : "Region*",
              "location_id",
              "location_id"
            )}
            getInputValue={(val: any) => val?.id || ""}
            setFormValue={setValue}
            defaultValue={selectedLocation}
            onChange={(val) => setSelectedLocation(val)}
          />
        ) : null}

        {isAdmin ? (
          <Select
            label={isAdmin ? "Salary(optional)" : "Salary*"}
            options={salaries}
            renderOption={(opt) => opt.salary}
            // error={!!errors.job_salary_id}
            // register={register}
            setFormValue={setValue}
            // helperText={errors.job_salary_id?.message}
            name="job_salary_id"
            id="job_salary_id"
            defaultValue={selectedSalary}
            onChange={(val) => setSelectedSalary(val)}
            getInputValue={(val) => val?.id || ""}
          />
        ) : (
          <Select
            label={isAdmin ? "Salary(optional)" : "Salary*"}
            options={salaries}
            renderOption={(opt) => opt.salary}
            error={!!errors.job_salary_id}
            register={register}
            setFormValue={setValue}
            helperText={errors.job_salary_id?.message}
            name="job_salary_id"
            id="job_salary_id"
            defaultValue={selectedSalary}
            onChange={(val) => setSelectedSalary(val)}
            getInputValue={(val) => val?.id || ""}
          />
        )}

        <TextAreaField
          {...getFieldAttribute(
            isAdmin ? "Job Description(optional)" : "Job Description*",
            "description",
            "description",
            "Type here"
          )}
          rows={8}
          labelDescription="You can always edit after posting your job"
        />
      </div>
      {showSubmit && <Button type="submit">Submit</Button>}
    </form>
  );
});

JobForm.displayName = "JobForm";

export default JobForm;
