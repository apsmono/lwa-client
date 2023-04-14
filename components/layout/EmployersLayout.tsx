import { EmployersSidebar } from "components/navigation";
import React, { ReactNode, useState } from "react";
import { Menu } from "react-feather";
import { User } from "service/types";
import GuestLayout from "./GuestLayout";

interface IEmployersLayoutProps {
  title: string;
  children: ReactNode;
  employers: User;
  navBarProps?: { className: string };
}
function EmployersLayout(props: IEmployersLayoutProps) {
  const { children, title, employers } = props;
  const [open, setOpen] = useState(false);
  const onSidebarClose = () => {
    setOpen(false);
  };
  return (
    <GuestLayout
      employers={employers}
      title={title}
      className="lg:ml-72 p-6 min-h-[70vh]"
      sidebar={
        <EmployersSidebar
          employers={employers}
          onClose={onSidebarClose}
          open={open}
        />
      }
      customLogo={
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      }
    >
      {children}
    </GuestLayout>
  );
}

export default EmployersLayout;
