import { yupResolver } from "@hookform/resolvers/yup";
import { TextAreaField, TextField } from "components/common";
import { Dropzone } from "components/common/forms";
import {
  DropzoneRefType,
  DropzoneValue,
} from "components/common/forms/Dropzone";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Company } from "service/types";
import { getFormAttribute, purgeInitialFormData } from "utils/form";
import { BASE_BLANK_FORM, schema } from "./constants";

interface CompanyFormProps {
  defaultValue: Partial<Company>;
  onLogoDrop: (file: File) => void;
}

export interface CompanyFormRef {
  getValues: () => { company: Partial<Company>; logo: DropzoneValue };
  submitForm: () => Promise<any>;
}

const CompanyForm = forwardRef<CompanyFormRef, Partial<CompanyFormProps>>(
  (props, ref) => {
    const { defaultValue = {}, onLogoDrop } = props;

    const [initialValue] = useState(() => {
      return purgeInitialFormData(defaultValue, BASE_BLANK_FORM);
    });

    const dropZoneRef = useRef<DropzoneRefType>(null);

    const {
      register,
      formState: { errors },
      getValues,
      handleSubmit,
    } = useForm({
      defaultValues: initialValue,
      resolver: yupResolver(schema),
    });

    const getFieldAttribute = (
      label: string,
      name: string,
      id: string,
      placeholder: string
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
          const company: Partial<Company> = { ...getValues() };
          const logo = dropZoneRef.current!.getValue();
          if (logo.preview) {
            company.company_logo = logo.preview;
          }
          return { company, logo };
        },
        submitForm: () => new Promise((res, rej) => handleSubmit(res, rej)()),
      }),
      [getValues, handleSubmit]
    );
    return (
      <div className="border border-black with-shadow rounded-2xl p-4">
        <TextField
          labelDescription="Enter your company or oranization's name"
          {...getFieldAttribute(
            "Company Name*",
            "company_name",
            "company_name",
            "Type here"
          )}
        />

        <TextField
          {...getFieldAttribute(
            "Company HQ*",
            "company_headquarter",
            "company_hq",
            "Type here"
          )}
          labelDescription="Where your company is officialy headquartered"
        />

        <Dropzone
          label="Company Logo*"
          ref={dropZoneRef}
          defaultImage={defaultValue.company_logo}
          onDropFiles={onLogoDrop}
        />

        <TextField
          {...getFieldAttribute(
            "Company's Website URL*",
            "company_url",
            "company_url",
            "Type here"
          )}
          labelDescription="Example: https://mybusiness.com/"
        />

        <TextField
          {...getFieldAttribute(
            "Email *",
            "company_email",
            "company_email",
            "Type here"
          )}
          labelDescription="We'll send your receipt and confirmation email here"
          type="email"
        />

        <TextAreaField
          {...getFieldAttribute(
            "What your company offer",
            "company_offer",
            "company_offer",
            "Type here"
          )}
        />

        <TextAreaField
          {...getFieldAttribute(
            "Tell us more about your company",
            "company_about",
            "company_about",
            "Type here"
          )}
        />
      </div>
    );
  }
);

CompanyForm.displayName = "CompanyForm";

export default CompanyForm;
