import Section from "@/components/home/section";
import Hero from "@/components/home/hero";
import Marquee from "@/components/home/marquee";
import { Link } from "react-router-dom";
import FeatureSection from "@/components/home/featured-section";
import { ArrowRightIcon } from "lucide-react";
import useRequest from "@/hooks/use-request";
import { useState, useEffect } from "react";
import { Service } from "@/types/service";

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const { makeRequest: getServices, loading } = useRequest("services", false);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getServices();
      if (response?.status === 200) {
        setServices(response.services);
      }
    };
    fetchServices();
  }, []);

  return (
    <main>
      <Hero />
      <Marquee />
      {/* <FeatureSection
        title={
          <span className="flex items-center gap-2 text-xl font-bold">
            Continue browsing
            <ArrowRightIcon />
          </span>
        }
      /> */}
      <Section
        services={services}
        loading={loading}
        title={
          <span>
            Most Popular in{" "}
            <Link to={"/"} className="text-blue-600">
              Plumbing
            </Link>
          </span>
        }
      />
      {/* <Section title={"Services you may need"} /> */}
    </main>
  );
};

export default Index;
