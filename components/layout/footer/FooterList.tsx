import { Typography } from "components/common";
import Link from "next/link";
import React from "react";

interface FooterListProps {
  title: string;
  list: { title: string; route: string }[];
}

function FooterList(props: FooterListProps) {
  const { list, title } = props;
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6" className="font-bold text-white">
        {title}
      </Typography>
      <ul className="flex flex-col gap-1">
        {list.map((item) => (
          <li key={item.title} className="text-white">
            <Link href={item.route}>
              <Typography>{item.title}</Typography>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterList;
