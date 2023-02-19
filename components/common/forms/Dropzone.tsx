import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useDropzone } from "react-dropzone";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

export type DropzoneValue = {
  file?: File;
  preview?: string;
};

export interface DropzoneRefType {
  getValue: () => DropzoneValue;
}

interface DropzoneProps {
  label: string;
  defaultImage?: string;
}

const Dropzone = forwardRef<DropzoneRefType, Partial<DropzoneProps>>(
  (props, ref) => {
    const { label, defaultImage } = props;
    const [preview, setPreview] = useState<string>(defaultImage || "");
    const { acceptedFiles, getInputProps, getRootProps } = useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: false,
      onDrop: (files) => {
        if (!files.length) setPreview("");
        setPreview(URL.createObjectURL(files[0]));
      },
    });

    useImperativeHandle(ref, () => ({
      getValue: () => {
        return {
          file: acceptedFiles[0],
          preview,
        };
      },
    }));

    return (
      <div className="mb-3">
        {label && <InputLabel>{label}</InputLabel>}
        <div className="border border-black with-shadow p-4 rounded-full cursor-pointer">
          <div className="flex justify-center" {...getRootProps()}>
            <input {...getInputProps()} />
            {preview ? (
              <DropzoneImage preview={preview} />
            ) : (
              <Typography>Click or drag your photo here to upload</Typography>
            )}
          </div>
        </div>
      </div>
    );
  }
);

interface DropzoneImageProps {
  preview: string;
}

const DropzoneImage = ({ preview }: DropzoneImageProps) => {
  if (preview.includes("blob")) {
    return (
      <div className="flex justify-center">
        <picture>
          <img src={preview} alt="Image" className="h-24 w-auto" />
        </picture>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <picture>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${preview}`}
          alt="Image"
          className="h-24 w-auto"
        />
      </picture>
    </div>
  );
};

Dropzone.displayName = "Dropzone";

export default Dropzone;
