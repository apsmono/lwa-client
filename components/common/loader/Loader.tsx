import clsx from "clsx";
import React from "react";
import style from "./Loader.module.css";

interface LoaderPropsInterface {
  className: string;
  color: string;
}

function Loader(props: Partial<LoaderPropsInterface>) {
  const { className, color = "black" } = props;
  return (
    <div className={clsx(style["lds-ring"], className)}>
      <div
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
      <div
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
      <div
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
      <div
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
    </div>
  );
}

export default Loader;
