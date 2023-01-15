import { Button } from "components/common";
import SectionTitle from "components/common/SectionTitle";
import { useRouter } from "next/router";
import React from "react";
import { Category } from "service/types";
import CategoryCard from "./CategoryCard";

interface PopularCategoryProps {
  categories: Category[];
}

function PopularCategory({ categories }: PopularCategoryProps) {
  const router = useRouter();
  const onClick = (category: Category) => {
    router.push(`/categories/${category.id}`);
  };
  return (
    <div className="flex flex-col">
      <SectionTitle>Popular Categories</SectionTitle>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
        {categories.map((category) => (
          <CategoryCard
            onClick={() => onClick(category)}
            category={category}
            key={category.id}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button>View More</Button>
      </div>
    </div>
  );
}

export default PopularCategory;
