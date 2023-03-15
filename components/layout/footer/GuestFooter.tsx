import { IconButton, Typography } from "components/common";
import Image from "next/image";
import React, { useMemo } from "react";
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
  const categoryList = useMemo(() => {
    const firstCol = categories.filter((_, i) => i % 2 === 0);
    const secondCol = categories.filter((_, i) => i % 2 !== 0);

    return [firstCol, secondCol];
  }, [categories]);

  return (
    <div className="flex flex-col md:flex-row justify-between bg-black p-6 gap-8 relative z-10">
      <div>
        <Typography
          className="text-white font-bold mb-3 font-palo uppercase"
          variant="h2"
        >
          let&apos;s work anywhere
        </Typography>
        <div className="flex gap-2">
          <IconButton contained color="secondary">
            <Instagram color="black" size={24} />
          </IconButton>
          <IconButton contained color="primary">
            <div className="relative w-[24px] h-[24px]">
              <Image src="/linkedin.png" fill alt="Linkedin" />
            </div>
          </IconButton>
          <IconButton contained color="secondary">
            <div className="relative w-[24px] h-[24px]">
              <Image src="/twitter.png" fill alt="Linkedin" />
            </div>
          </IconButton>
          <IconButton contained color="primary">
            <div className="relative w-[24px] h-[24px]">
              <Image src="/facebook.png" fill alt="Linkedin" />
            </div>
          </IconButton>
        </div>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">
        {categoryList.map((cl, i) => (
          <FooterList
            key={i}
            title={i === 0 ? "Categories" : <span>&nbsp;</span>}
            list={cl.map((c) => ({
              route: `/jobs?category_id=${c.id}`,
              title: c.name,
            }))}
          />
        ))}

        <div className="flex flex-col gap-4">
          <FooterList
            title="Employers"
            list={employersList.map((item) => ({
              route: item.route,
              title: item.title,
            }))}
          />
          <FooterList title="Useful Links" list={usefulLinks} />
        </div>
      </div>
    </div>
  );
}

export default GuestFooter;
