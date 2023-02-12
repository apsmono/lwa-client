import clsx from "clsx";
import { Button, Typography } from "components/common";
import React from "react";
import { Package } from "service/types";

interface PackageCardProps {
  item: Package;
  lastItem?: boolean;
  onClick: (item: Package) => void;
  isSelected?: boolean;
}

function PackageCard(props: PackageCardProps) {
  const { item, onClick, lastItem, isSelected } = props;
  return (
    <div
      className={clsx(
        "border-2 border-black with-shadow bg-primary-500 p-6 rounded-2xl flex flex-col gap-3",
        { "bg-primary-300": lastItem }
      )}
    >
      <div className="flex justify-between">
        <Typography variant="h5" className="font-bold">
          {item.name}
        </Typography>
        <Typography variant="h5" className="font-bold">
          {item.price > 0 ? "+" : ""}${item.price}
        </Typography>
      </div>
      <div
        className="text-sm flex flex-col gap-1"
        dangerouslySetInnerHTML={{ __html: item.perks }}
      />
      <Button
        onClick={() => onClick(item)}
        variant={!lastItem ? "white" : "primary"}
      >
        {isSelected ? "Current plan" : "Select this plan"}
      </Button>
    </div>
  );
}

export default PackageCard;
