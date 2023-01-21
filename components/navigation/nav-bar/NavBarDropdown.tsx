import clsx from "clsx";
import { Typography } from "components/common";
import Link from "next/link";
import React from "react";
import styles from "./NavBarDropdown.module.css";

type NavBarDropDownListType = {
  route: string;
  title: string;
};

interface NavBarDropdownPropsInterface {
  title: string;
  list: NavBarDropDownListType[];
}

function NavBarDropdown(props: NavBarDropdownPropsInterface) {
  const { title, list } = props;
  return (
    <div className={clsx(styles["dropdown-container"])}>
      <Typography>{title}</Typography>
      <ul
        className={clsx(
          styles["dropdown-content"],
          "shadow-md p-2 rounded-md w-52"
        )}
      >
        {list.map((item, index) => (
          <li className="mb-2" key={index}>
            <Link href={item.route}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBarDropdown;
