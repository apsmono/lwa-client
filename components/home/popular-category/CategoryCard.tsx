import { Typography } from "components/common";
import Image from "next/image";
import React from "react";
import { Category } from "service/types";

interface CategoryCard {
  onClick: () => void;
  category: Category;
}

function CategoryCard(props: Partial<CategoryCard>) {
  const { category, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="bg-primary-500 rounded-lg border border-black p-4 cursor-pointer flex flex-col items-center gap-4 max-w-60"
    >
      <div className="relative w-20 h-20 object-cover">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${category?.image_url}`}
          fill
          alt="Category"
        />
      </div>
      <Typography className="text-center">{category!.name}</Typography>
    </div>
  );
}

export default CategoryCard;
