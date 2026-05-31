import { useEffect, useState } from "react";
import apartment from "../assets/property-type-images/apartment-example.jpg";
import useRequest from "./use-request";
export type Categories = {
  name: string;
  id: string;
};

const useCategories = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const {
    makeRequest,
    loading: catLoading,
    error: catError,
  } = useRequest("business/category", false);

  const fetchCategories = async () => {
    makeRequest()
      .then((res) => {
        if (res.status === 200) {
          const data = res.result.map((category: Categories) => ({
            name: category.name,
            id: category.id,
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
