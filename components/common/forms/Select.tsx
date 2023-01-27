import { Transition, Listbox } from "@headlessui/react";
import clsx from "clsx";
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ChevronDown, X } from "react-feather";
import { UseFormRegister } from "react-hook-form";
import Chip from "../Chip";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

export interface SelectRefType {
  removeValue: (index?: number) => void;
}

interface SelectPropsInterface {
  options: any[];
  renderOption: (val: any) => string;
  label: string;
  onChange: (val: any) => void;
  name: string;
  id: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: string;
  getOptionSelected: (val: any) => boolean;
  defaultValue: any | any[];
  className: string;
  multiple: boolean;
  placeholder: string;
  showChip: boolean;
}

const Select = forwardRef<SelectRefType, Partial<SelectPropsInterface>>(
  (props, ref) => {
    const {
      options = [],
      error,
      getOptionSelected,
      helperText,
      id,
      label,
      name,
      onChange,
      register,
      renderOption = (val: any) => "",
      defaultValue,
      className,
      multiple,
      placeholder = "-",
      showChip,
    } = props;
    const [value, setValue] = useState(() => {
      if (defaultValue) return defaultValue;

      if (multiple) return [];

      return null;
    });
    const [query, setQuery] = useState("");
    const registerAttr = register ? register(name ?? "") : {};

    useImperativeHandle(
      ref,
      () => ({
        removeValue: (index?: number) => {
          if (!multiple) {
            setValue(null);
            return;
          }
          const curr = [...value];
          curr.splice(index!, 1);
          setValue(curr);
        },
      }),
      [multiple, value]
    );

    useEffect(() => {
      if (onChange) {
        onChange(value);
      }
    }, [value, onChange]);

    const renderValue = () => {
      if (multiple) {
        if (showChip) return placeholder;
        if (!value.length) return placeholder;
        return value.map((val: any) => renderOption(val)).join(", ");
      }
      if (value) return renderOption(value);
      return placeholder;
    };

    return (
      <div className={clsx("min-w-[8rem]", className)}>
        <input id={id} type="hidden" name={name} {...registerAttr} />
        <Listbox value={value || ""} onChange={setValue} multiple={multiple}>
          <div className="relative mt-1">
            {label && <InputLabel error={error}>{label}</InputLabel>}
            <div className="relative">
              <Listbox.Button
                className={clsx(
                  "relative w-full cursor-default overflow-hidden rounded-full bg-white text-left focus:outline-none border-black border-2 with-shadow px-2 py-1",
                  { "border-red-500": error }
                )}
              >
                <span
                  className={clsx("block truncate", { "text-red-500": error })}
                >
                  {renderValue()}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown
                    className={clsx(
                      { "text-black": !error },
                      { "text-red-500": error }
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
            </div>
            {error && (
              <Typography className="text-red-500">{helperText}</Typography>
            )}
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                {options.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    No data available
                  </div>
                ) : (
                  <>
                    {options.map((opt, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active, selected }) =>
                          clsx(
                            "relative cursor-pointer select-none py-2 px-4",
                            {
                              "bg-secondary-600 text-white": active || selected,
                            },
                            { "text-gray-900": !active && !selected }
                          )
                        }
                        value={opt}
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={clsx(
                                "block truncate",
                                {
                                  "font-medium": active || selected,
                                },
                                { "font-normal": !active && !selected }
                              )}
                            >
                              {renderOption(opt)}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </>
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {multiple && showChip && (
          <div className="mt-2">
            {value.map((val: any, index: number) => (
              <Chip key={index} variant="secondary">
                {renderOption(val)}
              </Chip>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
