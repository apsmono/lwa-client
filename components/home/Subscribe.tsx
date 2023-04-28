import clsx from "clsx";
import { Button, Select, TextField, Typography } from "components/common";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { Category } from "service/types";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppContext } from "context/appContext";
import useAlert from "utils/hooks/useAlert";
import SubscriberService from "service/susbcriber_service";
import { parseErrorMessage } from "utils/api";
import { SelectRefType } from "components/common/forms/Select";

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("This field is required"),
  category_id: yup
    .number()
    .typeError("This field is required")
    .required("This field is required"),
});

export type TSubscribeRef = {
  reset: () => void;
};

interface ISubscribeProps {
  categories: Category[];
  className?: string;
  variant?: "secondary" | "black";
}

const Subscribe = forwardRef<TSubscribeRef, ISubscribeProps>((props, ref) => {
  const { categories, className, variant = "black" } = props;

  const {
    reset,
    setValue,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { setLoading } = useContext(AppContext);
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const selectRef = useRef<SelectRefType>(null);

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const response = await SubscriberService.create(val);
      showSuccessAlert(response.message);
      reset();
      selectRef.current?.removeValue();
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      reset: () => reset(),
    }),
    [reset]
  );

  return (
    <div
      className={clsx(
        "px-6 rounded-2xl",
        className,
        { "bg-secondary-200": variant === "secondary" },
        { "bg-black": variant === "black" }
      )}
    >
      <div className="flex justify-center py-12 w-full">
        <div
          className={clsx("flex flex-col justify-center gap-2 md:w-2/3", {
            "text-white": variant === "black",
          })}
        >
          <Typography variant="h3" className="font-bold text-center mb-3">
            Subscribe now to receive daily job updates!
          </Typography>
          <div className="w-full mx-auto">
            <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <Select
                  ref={selectRef}
                  options={categories}
                  renderOption={(opt) => opt.name}
                  placeholder="Job Category"
                  className="w-full md:w-48"
                  register={register}
                  name="category_id"
                  error={!!errors?.category_id}
                  helperText={errors?.category_id?.message}
                  getInputValue={(val: any) => val?.id || ""}
                  setFormValue={setValue}
                />
                <TextField
                  placeholder="Type your email here"
                  containerProps={{ className: "md:flex-1 w-full" }}
                  register={register}
                  name="email"
                  error={!!errors?.email}
                  helperText={errors?.email?.message}
                />
                <div>
                  <Button
                    type="submit"
                    variant={variant === "black" ? "primary" : "secondary"}
                    withShadow={false}
                    className="mb-3"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

Subscribe.displayName = "Subscribe";

export default Subscribe;
