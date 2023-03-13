import React, { ReactNode } from "react";
import Typography from "./Typography";

interface SectionTitleProps {
  children: ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Typography
      variant="h2"
      className="font-bold text-center mb-4 font-palo uppercase"
    >
      {children}
    </Typography>
  );
}

export default SectionTitle;
