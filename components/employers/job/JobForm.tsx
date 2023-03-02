import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import {
  InputLabel,
  Select,
  TextAreaField,
  TextField,
} from "components/common";
import { Radio } from "components/common/forms";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Category,
  Company,
  EmploymentType,
  Job,
  LanguageType,
  LocationType,
} from "service/types";
import { getFormAttribute, purgeInitialFormData } from "utils/form";
import { BASE_BLANK_FORM, schema } from "./constants";

interface JobFormProps {
  categories: Category[];
  languages: LanguageType[];
  employmentTypes: EmploymentType[];
  locations: LocationType[];
  defaultValue: Partial<Company>;
  className: string;
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
  } = props;

  const [initialValue] = useState(() =>
    purgeInitialFormData(defaultValue, BASE_BLANK_FORM)
  );

  const [isWorldwide, setIsWordwide] = useState<boolean>(
    initialValue?.is_worldwide || undefined
  );

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<EmploymentType>();
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
          location: selectedLocation?.name || "",
          employment_type: selectedEmploymentType?.name || "",
        };
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
    ]
  );

  return (
    <div
      className={clsx("border border-black with-shadow rounded-2xl", className)}
    >
      <TextField
        {...getFieldAttribute(
          "How to apply*",
          "apply_link",
          "apply_link",
          "https://your-link.com"
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
        options={[
          { label: "Yes", value: true },
          { label: "No", value: false },
        ]}
        value={isWorldwide}
        onChange={(val) => setIsWordwide(val)}
      />

      {isWorldwide === false ? (
        <Select
          options={locations}
          renderOption={(opt) => opt.name}
          {...getFieldAttribute("Region*", "location_id", "location_id")}
          getInputValue={(val: any) => val?.id || ""}
          setFormValue={setValue}
          defaultValue={selectedLocation}
          onChange={(val) => setSelectedLocation(val)}
        />
      ) : null}

      <TextField
        labelDescription="Highly recommended! Providing salary will five your job more visibility"
        {...getFieldAttribute(
          "Salary",
          "salary",
          "salary",
          "Best format is $USD per year, such as: '$50k-60k'"
        )}
      />

      <TextAreaField
        {...getFieldAttribute(
          "Job Description*",
          "description",
          "description",
          "Type here"
        )}
        labelDescription="You can always edit after posting your job"
      />
    </div>
  );
});

JobForm.displayName = "JobForm";

export default JobForm;
