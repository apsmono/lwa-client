import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { ChevronDown } from "react-feather";

type DropDownListType = {
  route: string;
  title: string;
};

interface DropdownPropsInterface {
  title: string;
  list: DropDownListType[];
}

function Dropdown(props: Partial<DropdownPropsInterface>) {
  const { title, list } = props;
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="flex gap-2 items-center">
            {title}
            <ChevronDown
              size={18}
              className={clsx({ "rotate-180": open }, "transition-all")}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-2 flex flex-col gap-2">
                {(list || []).map((item) => (
                  <Menu.Item key={item.title}>
                    {({ active }) => (
                      <a href="#" className={clsx({ "font-medium": active })}>
                        {item.title}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default Dropdown;
