import clsx from "clsx";
import React from "react";

interface AlertProps {
  type: "success" | "error";
  msg: string;
  show: boolean;
}

function Alert(props: Partial<AlertProps>) {
  const { msg, show, type = "success" } = props;
  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
  };
  return (
    <div
      className={clsx(
        "w-full text-white py-2 text-center fixed z-50 transition-all duration-500",
        { "-translate-y-20": !show },
        styles[type] ?? styles["success"]
      )}
    >
      {msg}
    </div>
  );
}

export default Alert;
