import clsx from "clsx";
import { Backdrop, Button, TextField, Typography } from "components/common";
import { GuestSidebar } from "components/navigation";
import NavBarDropdown from "components/navigation/nav-bar/NavBarDropdown";
import { AppContext } from "context/appContext";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Menu } from "react-feather";
import { AuthService } from "service/auth_service";
import { User } from "service/types";
import { Category } from "service/types/category_type";
import useAuthStore from "store/useAuthStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import GuestFooter from "./footer/GuestFooter";

interface GuestLayoutProps {
  title: string;
  children: ReactNode;
  categories: Category[];
  employers?: User;
  navBarProps?: { className: string };
  sidebar?: ReactNode;
  showLogo?: boolean;
  className?: string;
}

function GuestLayout(props: GuestLayoutProps) {
  const {
    title,
    children,
    showLogo = true,
    categories,
    navBarProps,
    sidebar,
    className,
  } = props;
  const router = useRouter();
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const { setLoading } = useContext(AppContext);
  const { setAuth } = useAuthStore();
  const [employers, setEmployers] = useState(null);
  const wrappedLogout = useWrapHandleInvalidToken((refreshToken: string) =>
    AuthService.logout(refreshToken)
  );

  const handleLogout = async () => {
    const refreshToken = Cookies.get("refreshToken")!;

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

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setTimeout(() => {
      showSuccessAlert("Logout success");
      router.replace("/auth/sign-in");
    }, 300);
  };
  const employersList = useMemo(() => {
    if (!employers) {
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
  }, [employers]);
  const [jobTitle, setJobTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [openSidebar, setOpenSidebar] = useState(false);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const response = await AuthService.fetchMe();
      if (!active) return;
      setEmployers(response.data);
    };

    if (accessToken) fetchData();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchJobs = async (e: FormEvent) => {
    e.preventDefault();
    if (jobTitle) {
      router.push(`/jobs?title=${jobTitle}`);
    }
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative">
        {sidebar}
        <GuestSidebar
          categories={categories}
          onClose={() => setOpenSidebar(false)}
          open={openSidebar}
          employersMenu={employersList}
        />
        <div>
          <div
            className={clsx(
              "flex flex-col p-6 lg:px-24 gap-6 relative",
              navBarProps?.className
            )}
          >
            <div className="flex justify-between items-center">
              {showLogo ? (
                <picture>
                  <img
                    src="/lwa-logo.png"
                    alt="Logo"
                    className="h-12 cursor-pointer"
                    onClick={() => router.push("/")}
                  />
                </picture>
              ) : (
                <div />
              )}
              <div className="hidden lg:flex gap-8 items-center">
                <NavBarDropdown
                  title="Categories"
                  list={categories.map((item) => ({
                    title: item.name,
                    route: `/jobs?category_id=${item.id}`,
                  }))}
                />
                <button
                  onClick={() => {
                    if (!openSearchBar) {
                      setTimeout(() => {
                        inputRef.current?.focus();
                      }, 100);
                    }
                    setOpenSearchBar(!openSearchBar);
                  }}
                >
                  <Typography>Search Job</Typography>
                </button>
                <NavBarDropdown title="Employers" list={employersList} />
                <Button
                  variant="black"
                  withShadow={false}
                  onClick={() => router.push("/post-a-job")}
                >
                  Post a Job
                </Button>
              </div>
              <button
                onClick={() => setOpenSidebar(true)}
                className="block lg:hidden"
              >
                <Menu />
              </button>
            </div>

            <div className="lg:block absolute w-full inset-0 top-16 hidden z-10">
              <div
                className={clsx("transition-all visible w-[65%] mx-auto", {
                  "opacity-0 invisible": !openSearchBar,
                })}
              >
                <form onSubmit={handleSearchJobs}>
                  <TextField
                    ref={inputRef}
                    placeholder="e.g Full stack developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>

          <div className={className}>{children}</div>
        </div>
      </div>
      <GuestFooter categories={categories} employersList={employersList} />
      <Backdrop
        show={openSidebar}
        onClick={() => setOpenSidebar(false)}
        className="lg:invisible"
      />
    </>
  );
}

export default GuestLayout;
