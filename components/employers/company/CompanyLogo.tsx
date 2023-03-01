import clsx from "clsx";
import Image from "next/image";
import React, { useMemo } from "react";

interface CompanyLogoProps {
  src?: string;
  className?: string;
}

function CompanyLogo({ src, className }: CompanyLogoProps) {
  const imgSrc = useMemo(() => {
    if (!src) return "";

    if (src.includes("blob")) {
      return src;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${src}`;
  }, [src]);
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
    <div className={clsx("w-12 h-12 relative rounded-full", className)}>
      <Image
        fill
        src={imgSrc}
        alt="Company logo"
        className="rounded-full"
        style={{ objectFit: "cover", backgroundPosition: "center" }}
      />
    </div>
  );
}

export default CompanyLogo;
