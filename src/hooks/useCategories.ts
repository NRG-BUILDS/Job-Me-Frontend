import { useEffect, useState } from "react";
import useRequest from "./use-request";

export type Subcategory = {
  _id?: string;
  name: string;
  slug: string;
};

export type Categories = {
  _id: string;
  id: string;
  name: string;
  icon?: string;
  slug: string;
  subcategories: Subcategory[];
};

const useCategories = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const {
    makeRequest,
    loading: catLoading,
    error: catError,
  } = useRequest("categories", false);

  const fetchCategories = async () => {
    makeRequest()
      .then((res) => {
        if (res.status === 200) {
          const data = res.categories.map((category: any) => ({
            _id: category._id,
            id: category._id,
            name: category.name,
            icon: category.icon || "",
            slug: category.slug,
            subcategories: category.subcategories || [],
          }));
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, catLoading, catError, fetchCategories };
};

export default useCategories;
