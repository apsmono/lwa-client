import { EmployersSidebar } from "components/navigation";
import React, { ReactNode, useState } from "react";
import { Menu } from "react-feather";
import { User } from "service/types";
import clsx from "clsx";
import { Backdrop, Typography } from "components/common";
import { CompanyLogo } from "components/employers/company";
import useAuthStore from "store/useAuthStore";

interface IEmployersLayoutProps {
  title?: string;
  children: ReactNode;
  employers?: User;
  navBarProps?: { className: string };
  meta?: ReactNode;
}
function EmployersLayout(props: IEmployersLayoutProps) {
  const { children } = props;
  const [open, setOpen] = useState(false);
  const onSidebarClose = () => {
    setOpen(false);
  };
  const { user } = useAuthStore();
  return (
    <>
      <div className={clsx("relative h-full")}>
        <EmployersSidebar onClose={onSidebarClose} open={open} />
        <div className="lg:ml-72 p-6 lg:pl-12 min-h-[100vh] pb-64">
          <div className="flex justify-between lg:justify-end mb-12">
            <button onClick={() => setOpen(true)} className="block lg:hidden">
              <Menu />
            </button>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <CompanyLogo size="sm" src={user?.company?.company_logo} />
                <div>
                  <Typography className="font-bold">{user?.name}</Typography>
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
