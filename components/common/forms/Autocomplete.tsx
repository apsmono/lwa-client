import { Combobox, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "react-feather";
import { UseFormRegister } from "react-hook-form";
import Typography from "../Typography";
import InputLabel from "./InputLabel";

interface AutocompletePropsInterface {
  options: any[];
  renderOption: (val: any) => string;
  fetchItems: (query: string) => Promise<any[]>;
  label: string;
  onChange: (val: any) => void;
  name: string;
  id: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: string;
  onQueryChange: (val: string) => void;
  getOptionSelected: (val: any) => boolean;
  defaultValue: any;
}

function Autocomplete(props: Partial<AutocompletePropsInterface>) {
  const {
    options,
    error,
    fetchItems,
    getOptionSelected,
    helperText,
    id,
    label,
    name,
    onChange,
    onQueryChange,
    register,
    renderOption = (val: any) => "",
    defaultValue,
  } = props;
  const [value, setValue] = useState(defaultValue);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<any[]>();
  const registerAttr = register ? register(name ?? "") : {};

  useEffect(() => {
    if (onQueryChange) {
      onQueryChange(query);
    }
  }, [query, onQueryChange]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const response = await fetchItems!(query);
      if (!active) return;
      setItems(response);
    };

    if (fetchItems) {
      fetchData();
    }
  }, [query, fetchItems]);

  const filteredOptions = useMemo(() => {
    if (items) return items;

    if (!options) return [];

    return query === ""
      ? options
      : options.filter((opt) =>
          renderOption(opt)
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [items, options, query, renderOption]);

  return (
    <div>
      <input id={id} type="hidden" name={name} {...registerAttr} />
      <Combobox
        value={value || ""}
        onChange={(val: any) => {
          setValue(val);
          if (onChange) {
            onChange(val);
          }
        }}
      >
        <div className="relative mt-1">
          {label && <InputLabel error={error}>{label}</InputLabel>}
          <div className="relative">
            <Combobox.Input
              className={clsx(
                "w-full py-1 px-2 focus:outline-none border-2 rounded-full with-shadow relative",
                {
                  "border-black": !error,
                  "border-red-500": error,
                }
              )}
              displayValue={renderOption}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className={clsx(
                  { "text-black": !error },
                  { "text-red-500": error }
                )}
                aria-hidden="true"
              />
            </Combobox.Button>
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
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  No data available
                </div>
              ) : (
                <>
                  {filteredOptions.map((opt, index) => (
                    <Combobox.Option
                      key={index}
                      className={({ active }) =>
                        clsx(
                          "relative cursor-pointer select-none py-2 px-4",
                          { "bg-secondary-600 text-white": active },
                          { "text-gray-900": !active }
                        )
                      }
                      value={opt}
                    >
                      {({ active }) => (
                        <>
                          <span
                            className={clsx(
                              "block truncate",
                              {
                                "font-medium": active,
                              },
                              { "font-normal": !active }
                            )}
                          >
                            {renderOption(opt)}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default Autocomplete;
