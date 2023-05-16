import clsx from "clsx";
import { Button, Typography } from "components/common";

import React from "react";
import { Package } from "service/types";
import PromoRibbon from "./PromoRibbon";

interface PackageCardProps {
  item: Package;
  lastItem?: boolean;
  onClick?: (item: Package) => void;
  isSelected?: boolean;
  disabled?: boolean;
}

function PackageCard(props: PackageCardProps) {
  const { item, onClick = (item) => {}, isSelected, disabled } = props;
  return (
    <div
      className={clsx(
        "border p-6 rounded-2xl flex flex-col gap-3 justify-between relative",
        { "border-primary-500": isSelected },
        { "bg-neutral-100": disabled },
        { "border-neutral-300": !isSelected }
      )}
    >
      <div className="flex flex-col gap-1">
        <Typography variant="h5" className="font-medium">
          {item.name}
        </Typography>
        {item.price > 0 ? (
          <Typography variant="h2" className="font-bold">
            {item.price > 0 ? "+" : ""}${item.price}
          </Typography>
        ) : null}
        {item.description ? (
          <Typography variant="h2" className="font-bold">
            {item.description}
          </Typography>
        ) : null}

        <ul className="flex flex-col gap-1 mt-3">
          {item.perks
            .filter((perk) => perk.is_active)
            .map((perk) => {
              return (
                <li key={perk.id} className="flex gap-2 items-center">
                  <picture className="w-4">
                    <img
                      alt="Check"
                      src={
                        perk.is_active
                          ? "/check-active.svg"
                          : "/check-inactive.svg"
                      }
                      className="w-4 h-4"
                    />
                  </picture>
                  <Typography variant="small">{perk.perks}</Typography>
                </li>
              );
            })}
        </ul>
      </div>
      <Button
        onClick={() => onClick(item)}
        disabled={disabled}
        variant={!isSelected ? "white" : "primary"}
        filled={isSelected}
        className={clsx("border border-primary-500", {
          "text-neutral-500": !isSelected,
        })}
      >
        {isSelected ? "Current plan" : "Select plan"}
      </Button>

      {item.promo ? <PromoRibbon text={item.promo} /> : null}
    </div>
  );
}

export default PackageCard;
