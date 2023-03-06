import { Typography } from "components/common";
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
      className="bg-primary-500 rounded-lg border-2 border-black py-4 cursor-pointer flex flex-col items-center gap-4 max-w-60 hover:with-shadow transition-all"
    >
      <Typography className="text-center font-bold">
        {category!.name}
      </Typography>
    </div>
  );
}

export default CategoryCard;
