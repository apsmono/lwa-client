import { Typography } from "components/common";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { X } from "react-feather";

interface BlankLayoutProps {
  title?: string;
  children: ReactNode;
  onBack?: () => void;
}
function BlankLayout(props: BlankLayoutProps) {
  const { children, onBack } = props;
  const router = useRouter();
  const onBackButtonClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };
  return (
    <>
      <div className="flex justify-between p-6 items-center">
        <Link href="/" className="flex gap-2 items-center">
          <picture>
            <img src="/icon.svg" alt="Logo" className="h-6 cursor-pointer" />
          </picture>
          <Typography variant="h5">Let&apos;s Work Anywhere</Typography>
        </Link>

        <button onClick={onBackButtonClick}>
          <X />
        </button>
      </div>
      {children}
    </>
  );
}

export default BlankLayout;
