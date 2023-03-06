import { Button, Select, TextField, Typography } from "components/common";
import React from "react";
import { Category } from "service/types";

interface ISubscribeProps {
  categories: Category[];
}

function Subscribe(props: ISubscribeProps) {
  const { categories } = props;
  return (
    <div className="bg-primary-500 px-6">
      <div className="max-w-5xl flex justify-center mx-auto py-12">
        <div className="flex flex-col justify-center gap-2">
          <Typography variant="h3" className="font-bold">
            Subscribe now to receive daily job updates!
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Select
              options={categories}
              renderOption={(opt) => opt.name}
              placeholder="Job Category"
              className="w-full md:w-48"
            />
            <TextField
              placeholder="Type your email here"
              containerProps={{ className: "flex-1" }}
            />
          </div>
          <div className="flex justify-center">
            <Button variant="black" withShadow={false}>
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
