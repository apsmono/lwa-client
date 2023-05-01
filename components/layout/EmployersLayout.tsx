import { EmployersSidebar } from "components/navigation";
import React, { ReactNode, useState } from "react";
import { Menu } from "react-feather";
import { User } from "service/types";
import Head from "next/head";
import clsx from "clsx";
import { Backdrop, Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";

interface IEmployersLayoutProps {
  title: string;
  children: ReactNode;
  employers: User;
  navBarProps?: { className: string };
  meta?: ReactNode;
}
function EmployersLayout(props: IEmployersLayoutProps) {
  const { children, title, employers, meta } = props;
  const [open, setOpen] = useState(false);
  const onSidebarClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {meta}
      </Head>
      <div className={clsx("relative h-full")}>
        <EmployersSidebar
          employers={employers}
          onClose={onSidebarClose}
          open={open}
        />
        <div className="lg:ml-72 p-6 pl-12 min-h-[100vh] pb-64">
          <div className="flex justify-between lg:justify-end">
            <button onClick={() => setOpen(true)} className="block lg:hidden">
              <Menu />
            </button>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <CompanyLogo size="sm" src={employers.company?.company_logo} />
                <div>
                  <Typography className="font-bold">
                    {employers.name}
                  </Typography>
                  <Typography variant="small" className="capitalize">
                    Senior recruiter
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
      <Backdrop
        // show={open}
        onClick={() => setOpen(false)}
        className="lg:invisible"
      />
    </>
  );
}

export default EmployersLayout;
