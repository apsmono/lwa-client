import { Typography } from "components/common";
import React from "react";
import styles from "./Package.module.css";
import clsx from "clsx";

interface IPromoRibbonProps {
  text: string;
}

function PromoRibbon(props: IPromoRibbonProps) {
  const { text } = props;
  return (
    <div
      className={clsx(
        "absolute top-0 right-5 w-16",
        styles["ribbon-container"]
      )}
    >
      <div
        className={clsx(
          "px-2 pt-2 pb-8 shadow-md bg-primary-500 rounded",
          styles["ribbon"]
        )}
      >
        <Typography className="text-center text-white" variant="xs">
          {text}
        </Typography>
      </div>
    </div>
  );
}

export default PromoRibbon;
