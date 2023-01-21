import { Backdrop, Button, Dropdown, Typography } from "components/common";
import { GuestSidebar } from "components/navigation";
import NavBarDropdown from "components/navigation/nav-bar/NavBarDropdown";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactNode, useMemo, useState } from "react";
import { Menu, Search } from "react-feather";
import { Category } from "service/types/category_type";
import GuestFooter from "./footer/GuestFooter";

interface GuestLayoutProps {
  title: string;
  children: ReactNode;
  categories: Category[];
}

function GuestLayout(props: GuestLayoutProps) {
  const { title, children, categories } = props;
  const router = useRouter();
  const employersList = useMemo(() => {
    return [
      {
        title: "Post a Job",
        route: "",
      },
      {
        title: "Create Employer Account",
        route: "",
      },
      {
        title: "Sign In",
        route: "/auth/sign-in",
      },
    ];
  }, []);

  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative">
        <GuestSidebar
          categories={categories}
          onClose={() => setOpenSidebar(false)}
          open={openSidebar}
          employersMenu={employersList}
        />
        <div>
          <div className="flex justify-between items-center mb-4 p-6 lg:px-24">
            <div
              className="relative h-5 w-72 cursor-pointer object-cover"
              onClick={() => router.push("/")}
            >
              <Image src="/lwa-logo.png" fill alt="logo" />
            </div>
            <div className="hidden lg:flex gap-8 items-center">
              <NavBarDropdown
                title="Categories"
                list={categories.map((item) => ({
                  title: item.name,
                  route: `/jobs?category_id=${item.id}`,
                }))}
              />
              <button className="flex justify-between gap-2 items-center">
                <Typography>Find a Job</Typography>
                <Search size={18} />
              </button>
              <NavBarDropdown title="Employers" list={employersList} />
              <Button variant="black" withShadow={false}>
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

          {children}
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
