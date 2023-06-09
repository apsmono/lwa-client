import clsx from "clsx";
import Link from "next/link";
import React, { ReactNode } from "react";
import styles from "./SidebarItem.module.css";
import { Typography } from "components/common";

interface ISidebarItemProps {
  link: {
    title: string;
    href: string;
    icon?: ReactNode;
    image?: string;
    imageActive?: string;
  };
  active?: boolean;
}

function SidebarItem(props: ISidebarItemProps) {
  const { link, active } = props;
  const activeClass = styles["active"];

  return (
    <li className={clsx(styles["list"], [active && activeClass])}>
      <span></span>
      <span></span>
      <Link
        href={link.href}
        passHref
        className={clsx(
          "w-full px-6 py-3 rounded-l-full transition-all font-medium flex gap-4 items-center",
          {
            "bg-white text-primary-500": active,
          },
          { "text-white": !active },
          styles["list-item"]
        )}
      >
        {link.icon ? (
          <div className={clsx(styles["icon"])}>{link.icon}</div>
        ) : null}
        {link.image || link.imageActive ? (
          <picture>
            <img
              className="w-5"
              src={active ? link.imageActive : link.image}
              alt=""
            />
          </picture>
        ) : null}
        <Typography variant="body">{link.title}</Typography>
      </Link>
    </li>
  );
}

export default SidebarItem;
