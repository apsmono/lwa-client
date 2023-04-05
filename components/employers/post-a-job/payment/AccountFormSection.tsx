import React, { forwardRef, useImperativeHandle, useRef } from "react";
import useAuthStore from "store/useAuthStore";
import AccountForm, { TAccountFormRef } from "../AccountForm";

export type TAccountFormSectionRef = TAccountFormRef;

interface IAccountFormSectionProps {}

const AccountFormSection = forwardRef<
  TAccountFormSectionRef,
  IAccountFormSectionProps
>((props, ref) => {
  const accountFormRef = useRef<TAccountFormRef>(null);

  const { accessToken } = useAuthStore();

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: () => accountFormRef.current!.handleSubmit(),
      getFormData: () => accountFormRef.current!.getFormData(),
    }),
    []
  );
  if (accessToken) return null;

  return (
    <div className="grid grid-cols-2">
      <div className="col-span-1">
        <AccountForm ref={accountFormRef} />
      </div>
    </div>
  );
});

AccountFormSection.displayName = "AccountFormSection";

export default AccountFormSection;
