import {
  ROUTE_EMPLOYERS_DASHBOARD,
  ROUTE_EMPLOYERS_LISTING,
} from "config/routes";
import { AppContext } from "context/appContext";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { AuthService } from "service/auth_service";
import { User } from "service/types";
import useAuthStore from "store/useAuthStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";

import MySidebar from "../MySidebar";
import { getCookie, removeCookies } from "cookies-next";
import SidebarItem from "./sidebar-item/SidebarItem";
import { Typography } from "components/common";
import { LogOut } from "react-feather";

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
        title: "Dashboard",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}`,
        image: "/ic-dashboard.png",
        imageActive: "/ic-dashboard-purple.png",
      },
      {
        title: "Manage Listings",
        href: ROUTE_EMPLOYERS_LISTING,
        image: "/ic-listing.png",
        imageActive: "/ic-listing-purple.png",
      },
      {
        title: "Post a Job",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/post-a-job`,
        image: "/ic-post-job.png",
        imageActive: "/ic-post-job-purple.png",
      },

      {
        title: "Purchase History",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/purchase-history`,
        image: "/ic-purchase.png",
        imageActive: "/ic-purchase-purple.png",
      },
      {
        title: "Account Settings",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/account`,
        image: "/ic-settings.png",
        imageActive: "/ic-settings-purple.png",
      },
    ],
    []
  );
  const wrappedLogout = useWrapHandleInvalidToken((refreshToken: string) =>
    AuthService.logout(refreshToken)
  );

  const handleLogout = async () => {
    setAuth({
      accessToken: "",
      refreshToken: "",
    });
    removeCookies("accessToken");
    removeCookies("refreshToken");
    router.replace("/auth/sign-in");
  };
  return (
    <MySidebar
      open={open}
      backdropProps={{ onClick: onClose, className: "lg:invisible" }}
      className="bg-primary-500 lg:translate-x-0 rounded-2xl top-5 left-5 p-0 mb-4 h-[95%]"
      withBackdrop
    >
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-2 justify-center pt-4">
          <picture>
            <img src="/lwa-logo-black.png" alt="" className="w-48" />
          </picture>
        </div>

        <ul className="flex flex-col gap-4 mt-10 pl-8">
          {links.map((link, i) => (
            <SidebarItem
              link={link}
              active={router.pathname === link.href}
              key={i}
            />
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="text-white font-medium w-full flex gap-4 items-center p-4"
            >
              <picture>
                <img className="w-5" src="/ic-sign-out.png" alt="" />
              </picture>
              <Typography variant="body">Sign Out</Typography>
            </button>
          </li>
        </ul>
      </div>
    </MySidebar>
  );
}

export default EmployersSidebar;
