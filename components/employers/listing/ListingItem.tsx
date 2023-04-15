import { Button, MyPopOver, Typography } from "components/common";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { Job } from "service/types";
import { dateFormat } from "utils/date";

interface IListingItemProps {
  job: Job;
  onDeleteClick?: () => void;
  onEditClick?: () => void;
  onPauseClick?: () => void;
}

function ListingItem(props: IListingItemProps) {
  const { job, onDeleteClick, onEditClick, onPauseClick } = props;
  return (
    <div className="rounded-lg flex items-center justify-between border-2 border-black p-4 w-full">
      <div className="flex gap-6">
        <div>
          <Typography className="font-bold">{job.title}</Typography>
          <Typography>
            Posted:{" "}
            {dateFormat(job.created_at, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </Typography>
        </div>
        <div>
          <Typography className="font-bold text-center">
            {job.click_counts}
          </Typography>
          <Typography>Clicks</Typography>
        </div>
        <div>
          <Typography className="font-bold text-center">Job Status:</Typography>
          <div className="uppercase px-6 border border-black rounded-full">
            {job.status}
          </div>
        </div>
      </div>
      <MyPopOver
        buttonComponent={<MoreHorizontal />}
        className="border-2 border-black"
      >
        <div className="flex flex-col items-center">
          <Button
            onClick={onEditClick}
            variant="link"
            className="text-center text-black"
          >
            Edit
          </Button>
          {job.status === "open" ? (
            <Button
              onClick={onPauseClick}
              variant="link"
              className="text-center text-black"
            >
              Pause
            </Button>
          ) : null}
          {job.status === "paused" ? (
            <Button
              onClick={onPauseClick}
              variant="link"
              className="text-center text-black"
            >
              Resume
            </Button>
          ) : null}
          {job.status !== "closed" ? (
            <Button
              variant="link"
              className="text-center text-black"
              onClick={onDeleteClick}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </MyPopOver>
    </div>
  );
}

export default ListingItem;
