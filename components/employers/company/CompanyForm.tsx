import { TextAreaField, TextField } from "components/common";
import { Dropzone } from "components/common/forms";
import React from "react";

function CompanyForm() {
  return (
    <div className="border border-black with-shadow rounded-2xl p-4">
      <TextField
        label="Company Name*"
        labelDescription="Enter your company or oranization's name"
        placeholder="Type here"
      />

      <TextField
        label="Company HQ*"
        labelDescription="Where your company is officialy headquartered"
        placeholder="Type here"
      />

      <Dropzone label="Company Logo*" />

      <TextField
        label="Company's Website URL*"
        labelDescription="Example: https://mybusiness.com/"
        placeholder="Type here"
      />

      <TextField
        label="Email*"
        labelDescription="We'll send your receipt and confirmation email here"
        type="email"
        placeholder="Type here"
      />

      <TextAreaField label="What your company offer" placeholder="Type here" />

      <TextAreaField
        label="Tell us more about your company*"
        placeholder="Type here"
      />
    </div>
  );
}

export default CompanyForm;
