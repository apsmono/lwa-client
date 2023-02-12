import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useDropzone } from "react-dropzone";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

export interface DropzoneRefType {
  getValue: () => { file?: File; preview?: string };
}

interface DropzoneProps {
  label: string;
}

const Dropzone = forwardRef<DropzoneRefType, Partial<DropzoneProps>>(
  (props, ref) => {
    const { label } = props;
    const [preview, setPreview] = useState<string>();
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
              <div className="flex justify-center">
                <picture>
                  <img src={preview} alt="Image" className="h-24 w-auto" />
                </picture>
              </div>
            ) : (
              <Typography>Click or drag your photo here to upload</Typography>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Dropzone.displayName = "Dropzone";

export default Dropzone;
