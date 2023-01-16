import { IconButton, Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Instagram } from "react-feather";
import { Category } from "service/types";
import FooterList from "./FooterList";

interface GuestFooterProps {
  categories: Category[];
  employersList: any[];
}

function GuestFooter(props: GuestFooterProps) {
  const { categories, employersList } = props;
  return (
    <div className="flex flex-col md:flex-row justify-between bg-black p-6 gap-8">
      <div>
        <Typography className="text-white font-bold mb-3" variant="h5">
          let&apos;s work anywhere
        </Typography>
        <div className="flex gap-2">
          <IconButton contained color="secondary">
            <Instagram color="black" size={18} />
          </IconButton>
          <IconButton contained color="primary">
            <div className="relative w-[18px] h-[18px]">
              <Image src="/linkedin.png" fill alt="Linkedin" />
            </div>
          </IconButton>
          <IconButton contained color="secondary">
            <div className="relative w-[18px] h-[18px]">
              <Image src="/twitter.png" fill alt="Linkedin" />
            </div>
          </IconButton>
          <IconButton contained color="primary">
            <div className="relative w-[18px] h-[18px]">
              <Image src="/facebook.png" fill alt="Linkedin" />
            </div>
          </IconButton>
        </div>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">
        <FooterList
          title="Categories"
          list={categories.map((category) => ({
            route: `/categories/${category.id}`,
            title: category.name,
          }))}
        />
        <FooterList
          title="Employers"
          list={employersList.map((item) => ({
            route: item.route,
            title: item.title,
          }))}
        />
      </div>
    </div>
  );
}

export default GuestFooter;
