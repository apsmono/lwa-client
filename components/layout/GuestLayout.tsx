import clsx from "clsx";
import { Backdrop, Button, TextField, Typography } from "components/common";
import { GuestSidebar } from "components/navigation";
import NavBarDropdown from "components/navigation/nav-bar/NavBarDropdown";
import { AppContext } from "context/appContext";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Menu } from "react-feather";
import { AuthService } from "service/auth_service";
import { User } from "service/types";
import useAuthStore from "store/useAuthStore";
import { parseErrorMessage } from "utils/api";
import useAlert from "utils/hooks/useAlert";
import useWrapHandleInvalidToken from "utils/hooks/useWrapHandleInvalidToken";
import GuestFooter from "./footer/GuestFooter";
import { getCookie, removeCookies } from "cookies-next";
import useAppStore from "store/useAppStore";

interface GuestLayoutProps {
  title: string;
  children: ReactNode;
  bottomComponent?: ReactNode;
  employers?: User;
  navBarProps?: { className: string };
  sidebar?: ReactNode;
  customLogo?: ReactNode;
  className?: string;
  meta?: ReactNode;
  addBottomSpace?: boolean;
}

function GuestLayout(props: GuestLayoutProps) {
  const {
    title,
    children,
    customLogo,
    navBarProps,
    sidebar,
    className,
    bottomComponent,
    addBottomSpace = true,
    meta,
  } = props;
  const router = useRouter();
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const { setLoading } = useContext(AppContext);
  const { user, setAuth, reset } = useAuthStore();
  const wrappedLogout = useWrapHandleInvalidToken((refreshToken: string) =>
    AuthService.logout(refreshToken)
  );
  const { categories } = useAppStore();

  const handleLogout = async () => {
    setAuth({
      accessToken: "",
      refreshToken: "",
    });
    removeCookies("accessToken");
    removeCookies("refreshToken");
    router.replace("/auth/sign-in");
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
  const [jobTitle, setJobTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [openSidebar, setOpenSidebar] = useState(false);

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {meta}
      </Head>
      <div className={clsx("relative", [addBottomSpace && "pb-12"])}>
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
              "flex flex-col p-6 w-full max-w-7xl gap-6 relative mx-auto",
              navBarProps?.className
            )}
          >
            <div className="flex justify-between items-center">
              <Link href="/" className="flex gap-2 items-center">
                <picture>
                  <img
                    src="/icon.svg"
                    alt="Logo"
                    className="h-6 cursor-pointer"
                  />
                </picture>
                <Typography variant="h5">Let&apos;s Work Anywhere</Typography>
              </Link>
              <div className="hidden lg:flex gap-8 items-center">
                <NavBarDropdown
                  title="🚀 Categories"
                  list={categories.map((item) => ({
                    title: item.name,
                    route: `/jobs?category_id=${item.id}`,
                  }))}
                />
                <Link href="/jobs">
                  <Typography>🔍 Advanced Search</Typography>
                </Link>
                <Link href="/blog">
                  <Typography>✍️ Blog</Typography>
                </Link>
                <NavBarDropdown title="💼 Employers" list={employersList} />
                <Button
                  withShadow={false}
                  onClick={() => router.push("/post-a-job")}
                  className="font-normal"
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

          <div className={clsx("md:mt-16", className)}>{children}</div>
        </div>
      </div>
      <div className="px-6">{bottomComponent}</div>
      <GuestFooter
        categories={categories}
        usefulLinks={usefulLinks}
        employersList={employersList}
      />
      <Backdrop
        show={openSidebar}
        onClick={() => setOpenSidebar(false)}
        className="lg:invisible"
      />
    </>
  );
}

export default GuestLayout;
