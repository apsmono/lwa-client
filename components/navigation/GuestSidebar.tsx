import clsx from "clsx";
import { Button } from "components/common";
import React from "react";
import { X } from "react-feather";
import { Category } from "service/types/category_type";
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
    <div
      className={clsx(
        "bg-white h-full w-72 visible fixed z-10 transition-all duration-300 overflow-y-auto md:-translate-x-80 p-6",
        [!open && "-translate-x-80"]
      )}
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
            route: `/categories/${category.id}`,
          }))}
        />
        <GuestSidebarItem
          title="Employers"
          list={employersMenu.map((menu) => ({
            title: menu.title,
            route: menu.route,
          }))}
        />
      </ul>
      <Button variant="black" withShadow={false}>
        Post a Job
      </Button>
    </div>
  );
}

export default GuestSidebar;
