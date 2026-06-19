import banner from "@/assets/images/hero_banner.jpg";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { ChevronRight, LucideSearch } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRequest from "@/hooks/use-request";
import { Skeleton } from "../ui/skeleton";

interface PopularCategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  serviceCount: number;
}

const Hero = () => {
  const [searchInput, setSearchInput] = useState("");
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>(
    [],
  );
  const navigate = useNavigate();

  const { makeRequest: fetchPopularCategories, loading: loadingCategories } =
    useRequest("categories/popular", false);

  useEffect(() => {
    const getPopular = async () => {
      try {
        const res = await fetchPopularCategories();
        if (res?.categories) {
          setPopularCategories(res.categories);
        }
      } catch (err) {
        console.error("Failed to fetch popular categories", err);
      }
    };
    getPopular();
  }, []);

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      navigate(`/explore?search=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <section className="relative flex items-center justify-center pt-10 lg:min-h-[70dvh]">
      <div className="max-w-4xl space-y-5 p-6 text-center text-lg">
        <h1 className="w-full text-5xl font-extrabold tracking-tight lg:text-6xl">
          Find Skilled Artisans
          <br />
          Near You
        </h1>
        <p className="text-xl font-medium leading-snug">
          Book trusted professionals in minutes—no more waiting, no more hassle.
        </p>
        <div className="flex w-full items-stretch py-2">
          <Input
            type="text"
            placeholder="Select a service"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full rounded-none border-r-0 py-1 focus:!outline-none focus:!ring-0"
          />

          <Button
            onClick={handleSearch}
            className="flex h-full items-center justify-center gap-2 rounded rounded-l-none py-2.5 !text-primary-foreground"
          >
            <span>Search</span>
            <LucideSearch size={36} />
          </Button>
        </div>
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2">
          <p>Popular:</p>
          {loadingCategories
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))
            : popularCategories.slice(0, 5).map((category) => (
                <Link key={category._id} to={`/categories/${category.slug}`}>
                  <button className="grid place-items-center whitespace-nowrap rounded-full border border-dark px-4 py-1 text-lg hover:border-primary hover:text-primary">
                    {category.name}
                  </button>
                </Link>
              ))}
          <Link to={"/categories"}>
            <button className="flex place-items-center whitespace-nowrap rounded-full border border-secondary bg-secondary px-4 py-1 text-lg font-medium text-heading">
              More Categories
              <ChevronRight />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
