import clsx from "clsx";
import { Typography } from "components/common";
import {
  ROUTE_EMPLOYERS_DASHBOARD,
  ROUTE_EMPLOYERS_LISTING,
} from "config/routes";
import { AppContext } from "context/appContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { AuthService } from "service/auth_service";
import { User } from "service/types";
import useAuthStore from "store/useAuthStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import { CompanyLogo } from "components/employers/company";
import MySidebar from "../MySidebar";
import { getCookie, removeCookies } from "cookies-next";

interface IEmployersSidebarProps {
  open: boolean;
  onClose: () => void;
  employers: User;
}

function EmployersSidebar(props: IEmployersSidebarProps) {
  const { open, onClose, employers } = props;
  const router = useRouter();
  const { setLoading } = useContext(AppContext);
  const { setAuth } = useAuthStore();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const links = useMemo(
    () => [
      {
        title: "Manage Listings",
        href: ROUTE_EMPLOYERS_LISTING,
      },
      { title: "Post a Job", href: `${ROUTE_EMPLOYERS_DASHBOARD}/post-a-job` },
      { title: "Analytics", href: `${ROUTE_EMPLOYERS_DASHBOARD}/analytics` },
      {
        title: "Purchase History",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/purchase-history`,
      },
      {
        title: "Account Settings",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/account`,
      },
    ],
    []
  );
  const wrappedLogout = useWrapHandleInvalidToken((refreshToken: string) =>
    AuthService.logout(refreshToken)
  );

  const handleLogout = async () => {
    const refreshToken = getCookie("refreshToken")!;

    try {
      setLoading(true);
      await wrappedLogout(refreshToken);
      setAuth({
        accessToken: "",
        refreshToken: "",
      });
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
  return (
    <MySidebar
      open={open}
      backdropProps={{ onClick: onClose, className: "lg:invisible" }}
      className="bg-secondary-100 lg:translate-x-0"
      withBackdrop
    >
      <div className="flex flex-col p-4 gap-6">
        <picture>
          <img src="/lwa-logo-black.png" alt="" />
        </picture>

        <div className="flex gap-2 items-center">
          <CompanyLogo src={employers.company?.company_logo} />
          <Typography className="font-bold">{employers.name}</Typography>
        </div>

        <ul className="flex flex-col gap-4">
          {links.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                passHref
                className={clsx(
                  "w-full text-center block p-2 rounded-lg transition-all",
                  {
                    "bg-white": router.pathname === link.href,
                  },
                  "hover:bg-white"
                )}
              >
                {link.title}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="text-center w-full hover:bg-white p-2 rounded-lg transition-all"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </MySidebar>
  );
}

export default EmployersSidebar;
