import clsx from "clsx";
import { Button } from "components/common";
import React from "react";
import { X } from "react-feather";
import { Category } from "service/types/category_type";
import MySidebar from "../MySidebar";
import GuestSidebarItem from "./GuestSidebarItem";

interface GuestSidebarProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  employersMenu: any[];
}

function GuestSidebar(props: Partial<GuestSidebarProps>) {
  const { open, onClose, categories = [], employersMenu = [] } = props;

  return (
    <MySidebar
      open={open}
      backdropProps={{ onClick: onClose, className: "lg:invisible" }}
      className="bg-white lg:-translate-x-80"
    >
      <div className="flex justify-end mb-4">
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <ul className="flex flex-col gap-2 mb-4">
        <GuestSidebarItem
          title="Categories"
          list={categories.map((category) => ({
            title: category.name,
            route: `/jobs?category_id=${category.id}`,
          }))}
        />
        <GuestSidebarItem
          title="Employers"
          list={employersMenu.map((menu) => ({
            title: menu.title,
            route: menu.route,
            onClick: menu.onClick,
          }))}
        />
      </ul>
      <Button variant="primary" withShadow={false}>
        Post a Job
      </Button>
    </MySidebar>
  );
}

export default GuestSidebar;
