import clsx from "clsx";
import React, { HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small" | "xs";
}

function Typography(props: Partial<TypographyProps>) {
  const { children, style, className, variant = "body" } = props;
  const styles = {
    h1: "text-4xl",
    h2: "text-3xl",
    h3: "text-2xl",
    h4: "text-xl",
    h5: "text-lg",
    h6: "text-base",
    body: "text-sm",
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
