import clsx from "clsx";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useDropzone } from "react-dropzone";
import useAlert from "utils/hooks/useAlert";
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
  maxSize?: number;
  onDropFiles?: (file: File) => void;
  className?: string;
}

const Dropzone = forwardRef<DropzoneRefType, Partial<DropzoneProps>>(
  (props, ref) => {
    const {
      label,
      defaultImage,
      maxSize = 256000,
      onDropFiles,
      className,
    } = props;
    const [preview, setPreview] = useState<string>(defaultImage || "");
    const { showErrorAlert } = useAlert();
    const { acceptedFiles, getInputProps, getRootProps } = useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: false,
      onDrop: (files, fileRejections) => {
        try {
          if (fileRejections.length) {
            const { code } = fileRejections[0].errors[0];
            if (code === "file-too-large") {
              showErrorAlert(
                `File is too large, max size is ${maxSize / 1000}Kb`
              );
            }
            setPreview("");
            return;
          }
          if (!files.length) setPreview("");
          if (onDropFiles) {
            onDropFiles(files[0]);
          }
          setPreview(URL.createObjectURL(files[0]));
        } catch (error) {
          setPreview("");
          showErrorAlert("Something went wrong");
        }
      },
      maxSize,
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
        <div
          className={clsx(
            "border border-black with-shadow p-4 rounded-2xl cursor-pointer flex flex-col justify-center",
            className
          )}
        >
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
