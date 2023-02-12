import {
  InputLabel,
  Select,
  TextAreaField,
  TextField,
} from "components/common";
import RadioButton from "components/common/forms/RadioButton";
import React from "react";
import {
  Category,
  EmploymentType,
  LanguageType,
  LocationType,
} from "service/types";

interface JobFormProps {
  categories: Category[];
  languages: LanguageType[];
  employmentTypes: EmploymentType[];
  locations: LocationType[];
}

function JobForm(props: Partial<JobFormProps>) {
  const {
    categories = [],
    employmentTypes = [],
    languages = [],
    locations = [],
  } = props;

  return (
    <div className="border border-black with-shadow rounded-2xl p-4">
      <TextField
        label="How to apply*"
        labelAppend="Required fields*"
        labelDescription="Link to application page"
        placeholder="https://your-link.com"
      />

      <TextField
        label="Job Title*"
        placeholder="eg.g. Project Manager, Senior Analyst"
      />

      <Select
        label="Category*"
        options={categories}
        renderOption={(opt) => opt.name}
      />

      <TextField label="Skill" placeholder="Type here" />

      <Select
        label="Language"
        options={languages}
        renderOption={(opt) => opt.name}
      />

      <Select
        label="Employment Type*"
        options={employmentTypes}
        renderOption={(opt) => opt.name}
      />

      <InputLabel description="Selecting ‘Yes’ means your future hire can work anywhere in the world without any location or time zone restrictions.">
        Is this role open worldwide *
      </InputLabel>

      <div className="flex gap-4">
        <RadioButton label="Yes" name="is_worldwide" />
        <RadioButton label="No" name="is_worldwide" />
      </div>

      <Select
        label="Region*"
        labelDescription="Where yo want to hire your ideal candidate"
        options={locations}
        renderOption={(opt) => opt.name}
      />

      <TextField
        label="Timezon"
        labelDescription="Where you want to hire your ideal candidate"
        placeholder="GMT"
      />

      <TextField
        label="Salary"
        labelDescription="Highly recommended! Providing salary will five your job more visibility"
        placeholder="Best format is $USD per year, such as: '$50k-60k'"
      />

      <TextAreaField
        label="Job Description*"
        labelDescription="You can always edit after posting your job"
        placeholder="Type here"
      />
    </div>
  );
}

export default JobForm;
