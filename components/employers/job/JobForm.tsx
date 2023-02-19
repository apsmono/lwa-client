import { yupResolver } from "@hookform/resolvers/yup";
import {
  InputLabel,
  Select,
  TextAreaField,
  TextField,
} from "components/common";
import RadioButton from "components/common/forms/RadioButton";
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
}

export interface JobFormRef {
  getValues: () => Partial<Job>;
  submitForm: () => Promise<any>;
}

const JobForm = forwardRef<JobFormRef, Partial<JobFormProps>>((props, ref) => {
  const {
    categories = [],
    employmentTypes = [],
    languages = [],
    locations = [],
    defaultValue = {},
  } = props;

  const [initialValue] = useState(() =>
    purgeInitialFormData(defaultValue, BASE_BLANK_FORM)
  );

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<EmploymentType>();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>();
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
          category_name: selectedCategory?.name || "",
          location: selectedLocation?.name || "",
          language: selectedLanguage?.name || "",
          employment_type: selectedEmploymentType?.name || "",
        };
        return job;
      },
      submitForm: () => new Promise((res, rej) => handleSubmit(res, rej)()),
    }),
    [
      getValues,
      handleSubmit,
      selectedCategory?.name,
      selectedEmploymentType?.name,
      selectedLanguage?.name,
      selectedLocation?.name,
    ]
  );

  return (
    <div className="border border-black with-shadow rounded-2xl p-4">
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
          "eg.g Project Manager, Senior Analyst"
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

      <TextField
        {...getFieldAttribute("Skill", "skill", "skill", "Type here")}
      />

      <Select
        options={languages}
        renderOption={(opt) => opt.name}
        {...getFieldAttribute("Language*", "language_id", "language_id")}
        getInputValue={(val: any) => val?.id || ""}
        setFormValue={setValue}
        defaultValue={selectedLanguage}
        onChange={(val) => setSelectedLanguage(val)}
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

      <div className="flex gap-4">
        <RadioButton
          {...getFieldAttribute("Yes", "is_worldwide", "is_worldwide1")}
          value={1}
        />
        <RadioButton
          {...getFieldAttribute("No", "is_worldwide", "is_worldwide2")}
          value={0}
        />
      </div>

      <Select
        labelDescription="Where yo want to hire your ideal candidate"
        options={locations}
        renderOption={(opt) => opt.name}
        {...getFieldAttribute("Region*", "location_id", "location_id")}
        getInputValue={(val: any) => val?.id || ""}
        setFormValue={setValue}
        defaultValue={selectedLocation}
        onChange={(val) => setSelectedLocation(val)}
      />

      <TextField
        labelDescription="Where you want to hire your ideal candidate"
        {...getFieldAttribute("Timezone", "timezone", "timezone", "GMT")}
      />

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
