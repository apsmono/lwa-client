import clsx from "clsx";
import { Button, TextField, Typography } from "components/common";
import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { Category } from "service/types";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppContext } from "context/appContext";
import useAlert from "utils/hooks/useAlert";
import SubscriberService from "service/susbcriber_service";
import { parseErrorMessage } from "utils/api";

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("This field is required"),
});

export type TSubscribeRef = {
  reset: () => void;
};

interface ISubscribeProps {
  categories?: Category[];
  className?: string;
  variant?: "secondary" | "black";
}

const Subscribe = forwardRef<TSubscribeRef, ISubscribeProps>((props, ref) => {
  const { className, variant = "black" } = props;

  const {
    reset,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { setLoading } = useContext(AppContext);
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const response = await SubscriberService.create(val);
      showSuccessAlert("Thanks for subscribing");
      reset();
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
                <TextField
                  placeholder="Type your email here"
                  containerProps={{ className: "md:flex-1 w-full" }}
                  register={register}
                  name="email"
                  error={!!errors?.email}
                  helperText={errors?.email?.message}
                  className="text-black"
                  rounded
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
