import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, ReactNode } from "react";

interface IMyPopOverProps {
  children: ReactNode;
  buttonComponent?: ReactNode;
  className?: string;
}

function MyPopOver(props: IMyPopOverProps) {
  const { children, buttonComponent, className } = props;
  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center outline-none">
        {buttonComponent || "Button"}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          className={clsx(
            "absolute left-0 z-10 -translate-x-1/2 transform px-4 shadow-md rounded-lg bg-white border py-2",
            className
          )}
        >
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default MyPopOver;
