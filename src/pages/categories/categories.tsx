import React, { useState, useEffect } from "react";
import { Search, Menu, X, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/skills-ui/skill-card";
import useRequest from "@/hooks/use-request";
import { Skeleton } from "@/components/ui/skeleton";
import { Service } from "@/types/service";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesCache, setServicesCache] = useState<Record<string, Service[]>>({});

  const { makeRequest: fetchCategories, loading: loadingCategories } =
    useRequest("categories", false);
  const { makeRequest: fetchServices, loading: loadingServices } = useRequest(
    "",
    false
  );

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res?.categories) {
          setCategories(res.categories);
          if (res.categories.length > 0) {
            setSelectedCategory(res.categories[0].slug);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      if (servicesCache[selectedCategory]) {
        setServices(servicesCache[selectedCategory]);
        return;
      }

      const getServices = async () => {
        try {
          const res = await fetchServices(
            null,
            "GET",
            "application/json",
            `services/category/${selectedCategory}`
          );
          const newServices = res?.services || [];
          setServices(newServices);
          setServicesCache((prev) => ({
            ...prev,
            [selectedCategory]: newServices,
          }));
        } catch (err) {
          console.error("Failed to fetch services", err);
          setServices([]);
        }
      };
      getServices();
    }
  }, [selectedCategory]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCategory = categories.find((cat) => cat.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Browse Categories
              </h1>
            </div>
            <div className="hidden text-sm text-gray-500 md:block">
              {loadingCategories ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                `${categories.length} categories available`
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } w-full flex-shrink-0 lg:block lg:w-80`}
          >
            <div className="sticky top-24 rounded-lg border bg-white shadow-sm">
              <div className="border-b p-4">
                <h2 className="mb-3 font-semibold text-gray-900">
                  Filter Categories
                </h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                {loadingCategories ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => {
                        setSelectedCategory(category.slug);
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`flex w-full items-center justify-between border-b p-4 transition-colors hover:bg-gray-50 ${
                        selectedCategory === category.slug
                          ? "border-l-4 border-l-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {category.icon && (
                          <span className="text-2xl">{category.icon}</span>
                        )}
                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              selectedCategory === category.slug
                                ? "text-primary"
                                : "text-gray-900"
                            }`}
                          >
                            {category.name}
                          </p>
                        </div>
                      </div>
                      {selectedCategory === category.slug && (
                        <ChevronRight className="text-green-500" size={20} />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              {loadingCategories ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-5 w-48" />
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-center gap-3">
                    {currentCategory?.icon && (
                      <span className="text-4xl">{currentCategory.icon}</span>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900">
                      {currentCategory?.name || "Select a category"}
                    </h2>
                  </div>
                  {currentCategory?.description && (
                    <p className="text-gray-600">
                      {currentCategory.description}
                    </p>
                  )}
                </>
              )}
            </div>

            {loadingServices ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4 border p-4 bg-white">
                    <Skeleton className="aspect-[4/3] w-full bg-gray-200" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center gap-2 mt-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
                {services.map((service) => (
                  <SkillCard key={service._id} skill={service} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-white p-12 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  No Services Found
                </h3>
                <p className="text-gray-600">
                  There are currently no artisans in this category. Check back
                  later!
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
