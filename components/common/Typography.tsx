import clsx from "clsx";
import React, { HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small" | "xs";
}

function Typography(props: Partial<TypographyProps>) {
  const { children, style, className, variant = "body" } = props;
  const styles = {
    h1: "text-4xl md:text-5xl",
    h2: "text-3xl md:text-4xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-xl md:text-2xl",
    h5: "text-lg md:text-xl",
    h6: "text-base md:text-lg",
    body: "text-sm md:text-base",
    small: "text-sm",
    xs: "text-xs",
  };
  return (
    <p style={style} className={clsx(styles[variant], className)}>
      {children}
    </p>
  );
}

export default Typography;
