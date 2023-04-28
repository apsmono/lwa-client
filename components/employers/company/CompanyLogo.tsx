import clsx from "clsx";
import React, { useMemo } from "react";

interface CompanyLogoProps {
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function CompanyLogo({ src, className, size = "md" }: CompanyLogoProps) {
  const imgSrc = useMemo(() => {
    if (!src) return "";

    if (src.includes("blob")) {
      return src;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${src}`;
  }, [src]);
  const sizeStyles = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };
  if (!src) {
    return (
      <div
        className={clsx(
          "rounded-full border border-black",
          className,
          sizeStyles[size]
        )}
      />
    );
  }
  return (
    <picture>
      <img
        src={imgSrc}
        alt="Logo"
        className={clsx(
          "rounded-full object-contain object-center",
          className,
          sizeStyles[size]
        )}
      />
    </picture>
  );
}

export default CompanyLogo;
