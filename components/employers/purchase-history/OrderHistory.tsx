import { Typography } from "components/common";
import React from "react";
import { Job } from "service/types";
import { dateFormat } from "utils/date";
import { currencyFormat } from "utils/number";

interface IOrderHistoryProps {
  job: Job;
}

function OrderHistory(props: IOrderHistoryProps) {
  const { job } = props;
  return (
    <div className="border-2 border-black p-4 flex flex-col md:flex-row justify-between rounded-md">
      <div className="md:w-1/4">
        <Typography variant="xs">Description</Typography>
        <Typography className="font-bold" variant="small">
          {job.title}
        </Typography>
      </div>
      <div>
        <Typography variant="xs">Date</Typography>
        <Typography className="font-bold" variant="small">
          {dateFormat(job.created_at)}
        </Typography>
      </div>
      <div>
        <Typography variant="xs">Amount</Typography>
        <Typography className="font-bold" variant="small">
          {currencyFormat(job.price)}
        </Typography>
      </div>
      <div>
        <Typography variant="xs">Status</Typography>
        <div className="uppercase px-6 border border-black rounded-full">
          <Typography>{job.status}</Typography>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
