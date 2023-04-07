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
}

const Subscribe = forwardRef<TSubscribeRef, ISubscribeProps>((props, ref) => {
  const { categories, className } = props;

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
      className={clsx("bg-primary-500 px-6 border-t-2 border-black", className)}
    >
      <div className="max-w-5xl flex justify-center mx-auto py-12">
        <div className="flex flex-col justify-center gap-2">
          <Typography variant="h3" className="font-bold">
            Subscribe now to receive daily job updates!
          </Typography>
          <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
            <div className="flex flex-wrap gap-4">
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
                containerProps={{ className: "flex-1" }}
                register={register}
                name="email"
                error={!!errors?.email}
                helperText={errors?.email?.message}
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" variant="black" withShadow={false}>
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

Subscribe.displayName = "Subscribe";

export default Subscribe;
