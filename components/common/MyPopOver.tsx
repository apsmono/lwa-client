import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, {
  Fragment,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { X } from "react-feather";

export interface TMyPopOverRef {
  togglePanel: () => void;
}

interface IMyPopOverProps {
  children: ReactNode;
  buttonComponent?: ReactNode;
  className?: string;
  buttonProps?: {
    className?: string;
  };
  containerProps?: {
    className?: string;
  };
  showClose?: boolean;
}

const MyPopOver = forwardRef<TMyPopOverRef, IMyPopOverProps>((props, ref) => {
  const {
    children,
    buttonComponent,
    className,
    buttonProps,
    containerProps,
    showClose,
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      togglePanel() {
        buttonRef.current?.click();
      },
    }),
    []
  );
  return (
    <Popover className={clsx("relative", containerProps?.className)}>
      <Popover.Button
        className={clsx(
          "flex items-center outline-none",
          buttonProps?.className
        )}
        ref={buttonRef}
      >
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
          {({ close }) => {
            return (
              <>
                {showClose ? (
                  <div className="flex justify-end w-full my-2">
                    <button onClick={() => close()}>
                      <X size={18} />
                    </button>
                  </div>
                ) : null}
                {children}
              </>
            );
          }}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
});

MyPopOver.displayName = "MyPopOver";

export default MyPopOver;
