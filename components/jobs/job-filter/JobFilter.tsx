import clsx from "clsx";
import { Button } from "components/common";
import MyPopOver, { TMyPopOverRef } from "components/common/MyPopOver";
import { Checkbox, RadioButton } from "components/common/forms";
import { TAdvanceSelectRef } from "components/common/forms/AdvanceSelect";
import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "react-feather";
import styles from "./JobFilter.module.css";

interface IJobFilterProps {
  label: string;
  options: any[];
  renderOption: (val: any) => ReactNode;
  multiple: boolean;
  getOptionValue: (val: any) => any;
  defaultValue: any;
  onChange: (val: any) => void;
  showAction: boolean;
  className: string;
}

const JobFilter = forwardRef<TAdvanceSelectRef, Partial<IJobFilterProps>>(
  (props, ref) => {
    const {
      label,
      options = [],
      renderOption = (val) => val,
      getOptionValue = (val) => val,
      defaultValue,
      multiple,
      onChange,
      showAction,
      className,
    } = props;
    const popOverRef = useRef<TMyPopOverRef>(null);
    const [value, setValue] = useState(() => {
      if (defaultValue) return defaultValue;

      if (multiple) return [];

      return null;
    });

    useImperativeHandle(
      ref,
      () => ({
        removeValue: (index?: number) => {
          if (!multiple) {
            if (onChange) {
              onChange(null);
            }
            setValue(null);
            return;
          }
          if (!index) {
            setValue([]);
            if (onChange) {
              onChange([]);
            }
            return;
          }
          const curr = [...value];
          curr.splice(index, 1);
          setValue(curr);
          if (onChange) {
            onChange(curr);
          }
        },
      }),
      [multiple, onChange, value]
    );

    const handleValueChange = (newVal: any) => {
      if (!newVal) return;

      if (!multiple) {
        if (getOptionValue(newVal) === getOptionValue(value)) setValue(null);
        else setValue(newVal);
        return;
      }

      const valCopy = [...value];

      const index = valCopy.findIndex(
        (v) => getOptionValue(v) === getOptionValue(newVal)
      );
      if (index === -1) {
        valCopy.push(newVal);
      } else {
        valCopy.splice(index, 1);
      }
      setValue(valCopy);
    };

    useEffect(() => {
      if (showAction || !onChange) return;

      onChange(value);
      setTimeout(() => {
        popOverRef.current?.togglePanel();
      }, 250);
    }, [showAction, value, onChange]);

    const onShowResultClick = () => {
      if (onChange) {
        onChange(value);
        popOverRef.current?.togglePanel();
      }
    };

    const isHaveValue = useMemo(() => {
      if (multiple) return value.length;
      return !!value;
    }, [multiple, value]);
    return (
      <div className="mb-3 w-full sm:w-auto">
        <MyPopOver
          buttonProps={{
            className: clsx(
              "border border-neutral-500 relative rounded-full py-1 px-4 w-full transition-all",
              {
                "bg-primary-500 text-white": isHaveValue,
              }
            ),
          }}
          containerProps={{
            className: clsx("w-full sm:w-auto", styles.filter),
          }}
          buttonComponent={
            <>
              <p className="pr-5">{label}</p>
              <ChevronDown className="absolute right-2" />
            </>
          }
          className={clsx(
            "translate-x-0 w-full pt-8 md:w-auto min-w-[12rem] shadow-lg",
            styles["filter-content"],
            className
          )}
          ref={popOverRef}
        >
          {options?.map((opt, i) => {
            if (multiple) {
              return (
                <div key={i}>
                  <Checkbox
                    label={renderOption(opt)}
                    id={`${label}${i}`}
                    variant="primary"
                    onClick={() => handleValueChange(opt)}
                    defaultChecked={
                      (value || []).filter(
                        (v: any) => getOptionValue(v) === getOptionValue(opt)
                      ).length
                    }
                  />
                </div>
              );
            }
            return (
              <div key={i}>
                <Checkbox
                  readOnly
                  label={renderOption(opt)}
                  name={`${label}`}
                  id={`${label}${i}`}
                  className="text-primary-500 checked:border-primary-500"
                  onClick={() => handleValueChange(opt)}
                  checked={getOptionValue(opt) === getOptionValue(value)}
                  value={getOptionValue(opt)}
                />
              </div>
            );
          })}
          {showAction ? (
            <>
              <Button block onClick={onShowResultClick}>
                Show Result
              </Button>
              <Button
                onClick={() => popOverRef.current?.togglePanel()}
                className="mt-2 text-black"
                block
                variant="white"
              >
                Cancel
              </Button>
            </>
          ) : null}
        </MyPopOver>
      </div>
    );
  }
);

JobFilter.displayName = "JobFilter";

export default JobFilter;
