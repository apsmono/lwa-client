import { Button } from "components/common";
import SectionTitle from "components/common/SectionTitle";
import { AppContext } from "context/appContext";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import CategoryService from "service/category_service";
import { Category } from "service/types";
import CategoryCard from "./CategoryCard";

interface PopularCategoryProps {
  categories: Category[];
  totalItems: number;
}

function PopularCategory({ categories, totalItems }: PopularCategoryProps) {
  const [items, setItems] = useState(categories);
  const [offset, setOffset] = useState(2);
  const { setLoading } = useContext(AppContext);
  const router = useRouter();
  const onClick = (category: Category) => {
    router.push(`/jobs?category_id=${category.id}`);
  };

  const handleShowLessCategories = () => {
    const length = items.length;
    const spliceLength = length % 8 === 0 ? 8 : length % 8;
    setOffset((oldVal) => oldVal - 1);
    const copy = [...items];
    copy.splice(length - spliceLength, spliceLength);
    setItems(copy);
  };

  const handleShowMoreCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.gets({ offset, limit: 8 });
      const itemCopy = [...items, ...res.data];
      setItems(itemCopy);
      setOffset((oldVal) => oldVal + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col">
      <SectionTitle>Popular Categories</SectionTitle>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {items.map((category) => (
          <CategoryCard
            onClick={() => onClick(category)}
            category={category}
            key={category.id}
          />
        ))}
      </div>
      {totalItems > items.length && (
        <div className="flex justify-center mb-4">
          <Button onClick={handleShowMoreCategories}>View More</Button>
        </div>
      )}
      {items.length > 8 && (
        <div className="flex justify-center">
          <Button onClick={handleShowLessCategories} variant="link">
            View Less
          </Button>
        </div>
      )}
    </div>
  );
}

export default PopularCategory;
