import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";
import { ChevronDown } from "react-feather";

interface GuestSidebarProps {
  title: string;
  route: string;
  list: { title: string; route: string }[];
}

function GuestSidebarItem(props: Partial<GuestSidebarProps>) {
  const { title, list = [], route } = props;
  const [expand, setExpand] = useState(false);
  if (list.length) {
    return (
      <li
        className="flex cursor-pointer flex-col"
        onClick={() => setExpand(!expand)}
      >
        <div className="flex justify-between w-full">
          {title}{" "}
          <ChevronDown
            className={clsx({ "rotate-180": expand }, "transition-all")}
          />
        </div>
        <ul
          className={clsx(
            "max-h-52 transition-all pl-4 overflow-y-hidden duration-300",
            {
              "max-h-0": !expand,
            }
          )}
        >
          {list.map((item) => (
            <li key={item.title}>
              <Link href={item.route}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }
  return <li>{title}</li>;
}

export default GuestSidebarItem;
