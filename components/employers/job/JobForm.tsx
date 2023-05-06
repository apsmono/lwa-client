import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import {
  Button,
  InputLabel,
  Select,
  TextAreaField,
  TextField,
} from "components/common";
import { CurrencyField, Radio } from "components/common/forms";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Category,
  EmploymentType,
  Job,
  JobIndustry,
  LanguageType,
  LocationType,
} from "service/types";
import { getFormAttribute, purgeInitialFormData } from "utils/form";
import { BASE_BLANK_FORM, schema } from "./constants";
import { CompanySize } from "service/types/company_type";

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
  } = props;

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
        };
        if (!job.salary) {
          job.salary = 0;
        }
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
    ]
  );

  const submitForm = (val: any) => {
    delete val.language_id;
    delete val.timezone;
    if (!val.location_id) delete val.location_id;
    onSubmit(val);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className={clsx(className)}>
        <TextField
          {...getFieldAttribute(
            "How to apply*",
            "apply_link",
            "apply_link",
            "Type here"
          )}
          labelAppend="Required fields*"
          labelDescription="Link to application page"
        />

        <TextField
          {...getFieldAttribute(
            "Job Title*",
            "title",
            "title",
            "eg. Project Manager, Senior Analyst"
          )}
        />

        <Select
          options={categories}
          renderOption={(opt) => opt.name}
          {...getFieldAttribute("Category*", "category_id", "category_id")}
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
            "Employment Type*",
            "employment_type_id",
            "employment_type_id"
          )}
          getInputValue={(val: any) => val?.id || ""}
          setFormValue={setValue}
          defaultValue={selectedEmploymentType}
          onChange={(val) => setSelectedEmploymentType(val)}
        />

        <InputLabel description="Selecting ‘Yes’ means your future hire can work anywhere in the world without any location or time zone restrictions.">
          Is this role open worldwide *
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
            {...getFieldAttribute("Region*", "location_id", "location_id")}
            getInputValue={(val: any) => val?.id || ""}
            setFormValue={setValue}
            defaultValue={selectedLocation}
            onChange={(val) => setSelectedLocation(val)}
          />
        ) : null}

        <CurrencyField
          labelDescription="Highly recommended! Providing salary will five your job more visibility"
          {...getFieldAttribute(
            "Salary",
            "salary",
            "salary",
            "Best format is $USD per year, such as: '$50k-60k'"
          )}
          onValueChange={(val) => setValue("salary", val)}
        />

        <TextAreaField
          {...getFieldAttribute(
            "Job Description*",
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
