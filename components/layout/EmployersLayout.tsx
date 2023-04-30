import { EmployersSidebar, GuestSidebar } from "components/navigation";
import React, { ReactNode, useContext, useMemo, useState } from "react";
import { Menu } from "react-feather";
import { User } from "service/types";
import GuestLayout from "./GuestLayout";
import Head from "next/head";
import GuestFooter from "./footer/GuestFooter";
import useAppStore from "store/useAppStore";
import clsx from "clsx";
import useAuthStore from "store/useAuthStore";
import { AppContext } from "context/appContext";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import { getCookie, removeCookies } from "cookies-next";
import { AuthService } from "service/auth_service";
import { parseErrorMessage } from "utils/api";
import { useRouter } from "next/router";
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
  const { categories } = useAppStore();
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const { setLoading } = useContext(AppContext);
  const { user, setAuth, reset } = useAuthStore();
  const wrappedLogout = useWrapHandleInvalidToken((refreshToken: string) =>
    AuthService.logout(refreshToken)
  );
  const router = useRouter();
  const handleLogout = async () => {
    const refreshToken = getCookie("refreshToken")!;

    try {
      setLoading(true);
      await wrappedLogout(refreshToken);
      reset();
    } catch (error) {
      showErrorAlert(parseErrorMessage(error));
      return;
    } finally {
      setLoading(false);
    }

    removeCookies("accessToken");
    removeCookies("refreshToken");
    setTimeout(() => {
      showSuccessAlert("Logout success");
      router.replace("/auth/sign-in");
    }, 300);
  };
  const employersList = useMemo(() => {
    if (!user) {
      return [
        {
          title: "Post a Job",
          route: "/post-a-job",
        },
        {
          title: "Create Employer Account",
          route: "/auth/sign-up",
        },
        {
          title: "Sign In",
          route: "/auth/sign-in",
        },
      ];
    }
    return [
      {
        title: "Dashboard",
        route: "/employers/dashboard",
      },
      {
        title: "Post a Job",
        route: "/post-a-job",
      },
      {
        title: "Logout",
        route: "/",
        onClick: handleLogout,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const usefulLinks = useMemo(() => {
    return [
      { title: "Blog", route: "/blog" },
      { title: "FAQ", route: "/faq" },
      { title: "Terms and Conditions", route: "/terms-and-conditions" },
      { title: "Community Guidelines", route: "/community-guidelines" },
      { title: "Privacy", route: "/privacy" },
      { title: "Why Let's Work Anywhere?", route: "/why-lets-work-anywhere" },
    ];
  }, []);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {meta}
      </Head>
      <div className={clsx("relative")}>
        <EmployersSidebar
          employers={employers}
          onClose={onSidebarClose}
          open={open}
        />
        <div className="lg:ml-72 p-6 pl-12 min-h-[70v]">
          <div className="flex justify-between md:justify-end">
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
      <GuestFooter
        categories={categories}
        usefulLinks={usefulLinks}
        employersList={employersList}
      />
      <Backdrop
        // show={open}
        onClick={() => setOpen(false)}
        className="lg:invisible"
      />
    </>
  );
}

export default EmployersLayout;
