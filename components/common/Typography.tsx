import clsx from "clsx";
import React, { HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small";
}

function Typography(props: Partial<TypographyProps>) {
  const { children, style, className, variant = "body" } = props;
  const styles = {
    h1: "text-4xl lg:text-5xl",
    h2: "text-3xl lg:text-4xl",
    h3: "text-2xl lg:text-3xl",
    h4: "text-xl lg:text-2xl",
    h5: "text-lg lg:text-xl",
    h6: "text-base lg:text-lg",
    body: "text-sm lg:text-base",
    small: "text-sm",
  };
  return (
    <p style={style} className={clsx(styles[variant], className)}>
      {children}
    </p>
  );
}

export default Typography;
