import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface CompanyLogoProps {
  src?: string;
  className?: string;
}

function CompanyLogo({ src, className }: CompanyLogoProps) {
  if (!src) {
    return (
      <div
        className={clsx(
          "w-12 h-12 rounded-full border border-black",
          className
        )}
      />
    );
  }
  return (
    <div className={clsx("w-12 h-12 relative", className)}>
      <Image
        fill
        src={`${process.env.NEXT_PUBLIC_API_URL}${src}`}
        alt="Company logo"
      />
    </div>
  );
}

export default CompanyLogo;
