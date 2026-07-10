import Section from "@/components/home/section";
import Hero from "@/components/home/hero";
import Marquee from "@/components/home/marquee";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import useRequest from "@/hooks/use-request";
import { useState, useEffect } from "react";
import { Service } from "@/types/service";
import { SkillCard } from "@/components/skills-ui/skill-card";

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const { makeRequest: getServices, loading } = useRequest("services", false);

  const [promotedServices, setPromotedServices] = useState<{ recent: Service[], mostViewed: Service[] }>({ recent: [], mostViewed: [] });
  const [activeTab, setActiveTab] = useState<"recent" | "viewed">("recent");
  const { makeRequest: getPromoted, loading: loadingPromoted } = useRequest("services/promoted", false);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getServices();
      if (response?.status === 200) {
        setServices(response.services);
      }
    };
    fetchServices();

    const fetchPromoted = async () => {
      try {
        const response = await getPromoted();
        if (response?.success) {
          setPromotedServices({
            recent: response.recent || [],
            mostViewed: response.mostViewed || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch promoted services:", err);
      }
    };
    fetchPromoted();
  }, []);

  const hasPromoted = promotedServices.recent.length > 0 || promotedServices.mostViewed.length > 0;
  const currentPromotedList = activeTab === "recent" ? promotedServices.recent : promotedServices.mostViewed;

  return (
    <main className="bg-gray-50/50 pb-16">
      <Hero />
      <Marquee />

      {/* Apex Spotlights (Promoted Services) Section */}
      {hasPromoted && (
        <section className="px-4 py-12 md:px-12 max-w-7xl mx-auto">
          <div className="rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-orange-500/[0.03] p-6 md:p-10 shadow-sm relative overflow-hidden">
            {/* Background glowing decorations */}
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 size-72 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                  <Sparkles className="size-3 fill-current" />
                  Premium Showcases
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
                  Apex Spotlights
                </h2>
                <p className="mt-2 text-sm text-gray-600 max-w-md">
                  Discover top-rated services boosted by our highly recommended artisans.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200/50 shadow-inner">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                    activeTab === "recent"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Zap className="size-3.5" />
                  Rising Stars
                </button>
                <button
                  onClick={() => setActiveTab("viewed")}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                    activeTab === "viewed"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <TrendingUp className="size-3.5" />
                  Top Performers
                </button>
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-6 xl:grid-cols-5 relative z-10">
              {currentPromotedList.map((service, index) => (
                <Link to={`/service/${service._id}`} key={index} className="transition-transform duration-300 hover:-translate-y-1">
                  <SkillCard skill={service} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Section
        services={services}
        loading={loading}
        title={
          <span className="text-gray-900 font-extrabold text-2xl sm:text-3xl">
            Popular Services
          </span>
        }
      />
    </main>
  );
};

export default Index;
