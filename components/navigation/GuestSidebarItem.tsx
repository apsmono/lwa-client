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
        <div className="flex justify-between w-full mb-2">
          {title}{" "}
          <ChevronDown
            className={clsx({ "rotate-180": expand }, "transition-all")}
          />
        </div>
        <ul
          className={clsx(
            "max-h-0 transition-all pl-4 overflow-y-hidden duration-300 flex flex-col gap-1",
            {
              "max-h-[500px]": expand,
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
