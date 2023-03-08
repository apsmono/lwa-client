import Link, { LinkProps } from "next/link";
import React, { Children, ReactNode } from "react";

interface INavLinkProps extends LinkProps {
  activeClassName?: string;
  children: ReactNode;
}

function NavLink(props: INavLinkProps) {
  const { activeClassName = "active", children, ...otherProps } = props;
  const child = Children.only(children);
  return <Link {...otherProps}></Link>;
}

export default NavLink;
