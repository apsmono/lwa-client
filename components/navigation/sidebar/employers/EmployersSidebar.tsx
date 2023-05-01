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
        icon: (
          <svg
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 27.3332V8.6665H5.33333V27.3332H0ZM9.33333 27.3332V0.666504H14.6667V27.3332H9.33333ZM18.6667 27.3332V16.6665H24V27.3332H18.6667Z" />
          </svg>
        ),
      },
      {
        title: "Manage Listings",
        href: ROUTE_EMPLOYERS_LISTING,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14 0V9L17 6L20 9V0H24V24H6V0H14ZM0 0H4V24H0V0Z" />
          </svg>
        ),
      },
      {
        title: "Post a Job",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/post-a-job`,
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14.6667 9.33333V2L22 9.33333M2.66667 0C1.18667 0 0 1.18667 0 2.66667V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V8L16 0H2.66667Z" />
          </svg>
        ),
      },

      {
        title: "Purchase History",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/purchase-history`,
        icon: (
          <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14.7807 1.44784C14.2807 0.947706 13.6025 0.666655 12.8953 0.666504H3.33268C2.62544 0.666504 1.94716 0.947455 1.44706 1.44755C0.946967 1.94765 0.666016 2.62593 0.666016 3.33317V12.8958C0.666167 13.603 0.947217 14.2812 1.44735 14.7812L12.114 25.4478C12.6141 25.9478 13.2922 26.2286 13.9993 26.2286C14.7065 26.2286 15.3846 25.9478 15.8847 25.4478L25.4473 15.8852C25.9473 15.3851 26.2281 14.7069 26.2281 13.9998C26.2281 13.2927 25.9473 12.6146 25.4473 12.1145L14.7807 1.44784ZM7.33268 9.99984C6.62526 9.99966 5.94688 9.71847 5.44679 9.21812C4.94669 8.71777 4.66584 8.03926 4.66602 7.33184C4.66619 6.62442 4.94738 5.94604 5.44773 5.44594C5.94808 4.94585 6.62659 4.66499 7.33401 4.66517C8.04144 4.66535 8.71981 4.94654 9.21991 5.44689C9.72001 5.94723 10.0009 6.62575 10.0007 7.33317C10.0005 8.04059 9.71931 8.71897 9.21897 9.21906C8.71862 9.71916 8.0401 10 7.33268 9.99984Z" />
          </svg>
        ),
      },
      {
        title: "Account Settings",
        href: `${ROUTE_EMPLOYERS_DASHBOARD}/account`,
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.0007 0.333496C12.4151 0.333496 13.7717 0.895399 14.7719 1.89559C15.7721 2.89579 16.334 4.25234 16.334 5.66683C16.334 7.08132 15.7721 8.43787 14.7719 9.43807C13.7717 10.4383 12.4151 11.0002 11.0007 11.0002C9.58616 11.0002 8.22961 10.4383 7.22941 9.43807C6.22922 8.43787 5.66732 7.08132 5.66732 5.66683C5.66732 4.25234 6.22922 2.89579 7.22941 1.89559C8.22961 0.895399 9.58616 0.333496 11.0007 0.333496ZM11.0007 13.6668C16.894 13.6668 21.6673 16.0535 21.6673 19.0002V21.6668H0.333984V19.0002C0.333984 16.0535 5.10732 13.6668 11.0007 13.6668Z" />
          </svg>
        ),
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
      className="bg-primary-500 lg:translate-x-0 rounded-2xl top-5 left-5 p-0 mb-4"
      withBackdrop
    >
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-2 justify-center">
          <div className="text-center text-white">
            <p className="font-palo font-bold text-3xl">LET&apos;S WORK</p>
            <p className="font-palo font-bold text-3xl -mt-3">ANYWHERE</p>
          </div>
          <picture>
            <img src="/favicon.ico" alt="" className="w-14" />
          </picture>
        </div>

        <ul className="flex flex-col gap-4 mt-12 pl-8">
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
              <svg
                width="32"
                height="26"
                viewBox="0 0 32 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5"
              >
                <path
                  d="M13.0612 24.05C13.0612 24.1042 13.068 24.2396 13.0816 24.4562C13.0952 24.6729 13.0986 24.8523 13.0918 24.9945C13.085 25.1367 13.0646 25.2958 13.0306 25.4719C12.9966 25.6479 12.9286 25.7799 12.8265 25.868C12.7245 25.956 12.585 26 12.4082 26H5.87755C4.2585 26 2.87415 25.4279 1.72449 24.2836C0.57483 23.1393 0 21.7615 0 20.15V5.85C0 4.23854 0.57483 2.86068 1.72449 1.71641C2.87415 0.572135 4.2585 0 5.87755 0H12.4082C12.585 0 12.7381 0.0643229 12.8673 0.192969C12.9966 0.321615 13.0612 0.473958 13.0612 0.65C13.0612 0.704167 13.068 0.839583 13.0816 1.05625C13.0952 1.27292 13.0986 1.45234 13.0918 1.59453C13.085 1.73672 13.0646 1.89583 13.0306 2.07187C12.9966 2.24792 12.9286 2.37995 12.8265 2.46797C12.7245 2.55599 12.585 2.6 12.4082 2.6H5.87755C4.97959 2.6 4.21088 2.91823 3.57143 3.55469C2.93197 4.19115 2.61224 4.95625 2.61224 5.85V20.15C2.61224 21.0437 2.93197 21.8089 3.57143 22.4453C4.21088 23.0818 4.97959 23.4 5.87755 23.4H12.2449L12.4796 23.4203L12.7143 23.4812L12.8776 23.593L13.0204 23.7758L13.0612 24.05ZM32 13C32 13.3521 31.8707 13.6568 31.6122 13.9141L20.5102 24.9641C20.2517 25.2214 19.9456 25.35 19.5918 25.35C19.2381 25.35 18.932 25.2214 18.6735 24.9641C18.415 24.7068 18.2857 24.4021 18.2857 24.05V18.2H9.14286C8.78912 18.2 8.48299 18.0714 8.22449 17.8141C7.96599 17.5568 7.83673 17.2521 7.83673 16.9V9.1C7.83673 8.74792 7.96599 8.44323 8.22449 8.18594C8.48299 7.92865 8.78912 7.8 9.14286 7.8H18.2857V1.95C18.2857 1.59792 18.415 1.29323 18.6735 1.03594C18.932 0.778646 19.2381 0.65 19.5918 0.65C19.9456 0.65 20.2517 0.778646 20.5102 1.03594L31.6122 12.0859C31.8707 12.3432 32 12.6479 32 13Z"
                  fill="white"
                />
              </svg>
              <Typography variant="body">Sign Out</Typography>
            </button>
          </li>
        </ul>
      </div>
    </MySidebar>
  );
}

export default EmployersSidebar;
