import banner from "@/assets/images/hero_banner.jpg";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { ChevronRight, LucideSearch } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

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
          {[
            "Architecture",
            "Mansory",
            "POP Casting",
            "Auto Repair",
            "Furniture",
          ].map((skill) => (
            <button
              key={skill}
              className="grid place-items-center whitespace-nowrap rounded-full border border-dark px-4 py-1 text-lg hover:border-primary hover:text-primary"
            >
              {skill}
            </button>
          ))}
          <Link to={"/categories"}>
            <button className="flex place-items-center whitespace-nowrap rounded-full border border-secondary bg-secondary px-4 py-1 text-lg font-medium text-heading">
              +35 More Categories
              <ChevronRight />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
