import React, { useState } from "react";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/skills-ui/skill-card";

// Mock data for categories and services
const categories = [
  { id: "plumbing", name: "Plumbing", count: 45, icon: "🔧" },
  { id: "electrical", name: "Electrical", count: 38, icon: "⚡" },
  { id: "painting", name: "Painting", count: 52, icon: "🎨" },
  { id: "carpentry", name: "Carpentry", count: 29, icon: "🪚" },
  { id: "air-conditioning", name: "Air Conditioning", count: 31, icon: "❄️" },
  { id: "interior-design", name: "Interior Design", count: 24, icon: "🏠" },
  { id: "construction", name: "Construction", count: 41, icon: "🏗️" },
  { id: "tailoring", name: "Tailoring", count: 36, icon: "✂️" },
  { id: "gardening", name: "Gardening", count: 18, icon: "🌿" },
  { id: "welding", name: "Welding", count: 15, icon: "🔥" },
  { id: "cleaning", name: "Cleaning", count: 62, icon: "🧹" },
  { id: "tiling", name: "Tiling", count: 27, icon: "⬜" },
  { id: "beauty-services", name: "Beauty Services", count: 48, icon: "💄" },
  { id: "roofing", name: "Roofing", count: 22, icon: "🏚️" },
  { id: "catering", name: "Catering", count: 55, icon: "🍽️" },
  { id: "auto-repair", name: "Auto Repair", count: 34, icon: "🚗" },
  { id: "it-support", name: "IT Support", count: 43, icon: "💻" },
  { id: "photography", name: "Photography", count: 39, icon: "📸" },
  { id: "event-planning", name: "Event Planning", count: 26, icon: "🎉" },
  { id: "security", name: "Security", count: 19, icon: "🔒" },
];

const skills = [
  {
    id: "1",
    name: "Adebayo Cooling",
    title: "Top artisan",
    description: "I will install your sinks and water closet professionally",
    rating: 5.0,
    reviews: 3,
    avatar: "https://i.pravatar.cc/150?img=32",
    cover: "https://picsum.photos/seed/adebayo/600/400",
    category: "plumbing",
    location: "KANO",
  },
  {
    id: "2",
    name: "Chinedu Fixit",
    title: "Expert Technician",
    description: "Professional AC installation and servicing for homes.",
    rating: 4.8,
    reviews: 12,
    avatar: "https://i.pravatar.cc/150?img=76",
    cover: "https://picsum.photos/seed/chinedu/600/400",
    category: "air-conditioning",
    location: "LAGOS",
  },
  {
    id: "3",
    name: "Grace Interiors",
    title: "Creative Designer",
    description: "Transform your living spaces with modern interior designs.",
    rating: 4.9,
    reviews: 8,
    avatar: "https://i.pravatar.cc/150?img=45",
    cover: "https://picsum.photos/seed/grace/600/400",
    category: "interior-design",
    location: "ABUJA",
  },
  {
    id: "4",
    name: "Ibrahim Wiring",
    title: "Certified Electrician",
    description: "Safe and reliable electrical installations and repairs.",
    rating: 4.7,
    reviews: 15,
    avatar: "https://i.pravatar.cc/150?img=12",
    cover: "https://picsum.photos/seed/ibrahim/600/400",
    category: "electrical",
    location: "IBADAN",
  },
  {
    id: "5",
    name: "Funmi Paints",
    title: "Master Painter",
    description:
      "Quality painting services for residential and commercial properties.",
    rating: 4.6,
    reviews: 20,
    avatar: "https://i.pravatar.cc/150?img=23",
    cover: "https://picsum.photos/seed/funmi/600/400",
    category: "painting",
    location: "LAGOS",
  },
  {
    id: "6",
    name: "Emeka Builds",
    title: "Construction Specialist",
    description: "Expert bricklaying and building construction services.",
    rating: 4.9,
    reviews: 25,
    avatar: "https://i.pravatar.cc/150?img=33",
    cover: "https://picsum.photos/seed/emeka/600/400",
    category: "construction",
    location: "ENUGU",
  },
];

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("plumbing");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredServices = skills.filter(
    (service) => service.category === selectedCategory,
  );

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

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
              {categories.length} categories available
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
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`flex w-full items-center justify-between border-b p-4 transition-colors hover:bg-gray-50 ${
                      selectedCategory === category.id
                        ? "border-l-4 border-l-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <p
                          className={`font-medium ${
                            selectedCategory === category.id
                              ? "text-primary"
                              : "text-gray-900"
                          }`}
                        >
                          {category.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {category.count} artisans
                        </p>
                      </div>
                    </div>
                    {selectedCategory === category.id && (
                      <ChevronRight className="text-green-500" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-4xl">{currentCategory?.icon}</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentCategory?.name}
                </h2>
              </div>
              <p className="text-gray-600">
                {currentCategory?.count} artisans available in this category
              </p>
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
                {filteredServices.map((service) => (
                  <SkillCard key={service.id} skill={service} />
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

            {/* Load More Button */}
            {filteredServices.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Load More Services
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
