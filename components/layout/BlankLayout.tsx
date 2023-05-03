import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { X } from "react-feather";

interface BlankLayoutProps {
  title: string;
  children: ReactNode;
  onBack?: () => void;
}
function BlankLayout(props: BlankLayoutProps) {
  const { title, children, onBack } = props;
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
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex justify-between p-6 items-center">
        <picture>
          <img
            src="/lwa-logo.png"
            alt="Logo"
            className="h-10 cursor-pointer"
            onClick={() => router.push("/")}
          />
        </picture>

        <button onClick={onBackButtonClick}>
          <X />
        </button>
      </div>
      {children}
    </>
  );
}

export default BlankLayout;
