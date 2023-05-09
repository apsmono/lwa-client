import { IconButton, Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Instagram } from "react-feather";
import { Category } from "service/types";
import FooterList from "./FooterList";

interface GuestFooterProps {
  categories: Category[];
  employersList: any[];
  usefulLinks: any[];
}

function GuestFooter(props: GuestFooterProps) {
  const { categories, employersList, usefulLinks } = props;
  return (
    <div className="flex flex-col md:flex-row justify-between p-6 gap-8 relative z-10 text-black py-12">
      <div>
        <Typography className="font-bold mb-3 capitalize" variant="h4">
          let&apos;s work anywhere
        </Typography>
        <div className="flex gap-2">
          <IconButton
            contained
            color="primary"
            onClick={() => {
              if (window) {
                window.open("https://www.instagram.com/letsworkanywherecom/");
              }
            }}
          >
            <Instagram color="white" size={24} />
          </IconButton>
          <IconButton
            contained
            color="secondary"
            onClick={() => {
              if (window) {
                window.open("https://facebook.com/LWA_com");
              }
            }}
          >
            <div className="relative w-[24px] h-[24px]">
              <Image src="/facebook.png" fill alt="Linkedin" />
            </div>
          </IconButton>
          <IconButton
            contained
            color="primary"
            onClick={() => {
              if (window) {
                window.open("https://twitter.com/LWA_com");
              }
            }}
          >
            <div className="relative w-[24px] h-[24px]">
              <Image src="/twitter.png" fill alt="Linkedin" />
            </div>
          </IconButton>
          <IconButton
            contained
            color="secondary"
            onClick={() => {
              if (window) {
                window.open(
                  "https://www.linkedin.com/company/let-s-work-anywhere/"
                );
              }
            }}
          >
            <div className="relative w-[24px] h-[24px]">
              <Image src="/linkedin.png" fill alt="Linkedin" />
            </div>
          </IconButton>
        </div>
      </div>
      <FooterList
        title="Category"
        list={categories.map((c) => ({
          route: `/jobs?category_id=${c.id}`,
          title: c.name,
        }))}
      />

      <FooterList
        title="Employers"
        list={employersList.map((item) => ({
          route: item.route,
          title: item.title,
        }))}
      />
      <FooterList title="Useful Links" list={usefulLinks} />
    </div>
  );
}

export default GuestFooter;
