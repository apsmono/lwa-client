import React, { Fragment, ReactNode } from "react";
import { Transition, Dialog } from "@headlessui/react";
import clsx from "clsx";

interface ModalPropsInterface {
  open: boolean;
  children: ReactNode;
  className: string;
  onClose: () => void;
  size: "sm" | "md" | "lg" | "xl" | "2xl";
}

function Modal({
  open = false,
  onClose = () => {},
  children,
  className = "",
  size = "md",
}: Partial<ModalPropsInterface>) {
  const sizeStyle = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog className="relative z-50" open={open} as="div" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-70"
            aria-hidden="true"
          />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "bg-white w-full p-4 rounded-lg transform transition-all",
                  sizeStyle[size],
                  className
                )}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
