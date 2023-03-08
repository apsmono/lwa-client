import { EmployersSidebar } from "components/navigation";
import React, { ReactNode, useState } from "react";
import { Menu } from "react-feather";
import { Category, User } from "service/types";
import GuestLayout from "./GuestLayout";

interface IEmployersLayoutProps {
  title: string;
  children: ReactNode;
  categories: Category[];
  employers?: User;
  navBarProps?: { className: string };
}
function EmployersLayout(props: IEmployersLayoutProps) {
  const { children, categories, title, employers, navBarProps } = props;
  const [open, setOpen] = useState(false);
  const onSidebarClose = () => {
    setOpen(false);
  };
  return (
    <GuestLayout
      categories={categories}
      employers={employers}
      title={title}
      className="lg:ml-72 p-6"
      sidebar={<EmployersSidebar onClose={onSidebarClose} open={open} />}
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
