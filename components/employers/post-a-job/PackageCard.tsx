import clsx from "clsx";
import { Button, Typography } from "components/common";

import React from "react";
import { Package } from "service/types";

interface PackageCardProps {
  item: Package;
  lastItem?: boolean;
  onClick?: (item: Package) => void;
  isSelected?: boolean;
  disabled?: boolean;
}

function PackageCard(props: PackageCardProps) {
  const {
    item,
    onClick = (item) => {},
    lastItem,
    isSelected,
    disabled,
  } = props;
  return (
    <div
      className={clsx(
        "border-2 border-black with-shadow p-6 rounded-2xl flex flex-col gap-3 justify-between",
        { "bg-secondary-300": isSelected },
        { "bg-gray-200": disabled }
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <Typography variant="h3" className="font-bold font-palo uppercase">
          {item.name}
        </Typography>
        {item.price > 0 ? (
          <Typography variant="h5">
            {item.price > 0 ? "+" : ""}${item.price}
          </Typography>
        ) : null}
        {item.description ? (
          <Typography variant="h5">{item.description}</Typography>
        ) : null}
      </div>
      <ul className="flex flex-col gap-1">
        {item.perks.map((perk) => {
          return (
            <li key={perk.id} className="flex gap-2 items-center">
              <picture className="w-4">
                <img
                  alt="Check"
                  src={
                    perk.is_active ? "/check-active.svg" : "/check-inactive.svg"
                  }
                  className="w-4 h-4"
                />
              </picture>
              <Typography variant="small">{perk.perks}</Typography>
            </li>
          );
        })}
      </ul>
      <Button
        onClick={() => onClick(item)}
        disabled={disabled}
        variant={!isSelected ? "white" : "secondary"}
      >
        {isSelected ? "Current plan" : "Select this plan"}
      </Button>
    </div>
  );
}

export default PackageCard;
