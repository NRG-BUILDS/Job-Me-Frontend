import Section from "@/components/home/section";
import Hero from "@/components/home/hero";
import Marquee from "@/components/home/marquee";
import { Link } from "react-router-dom";
import FeatureSection from "@/components/home/featured-section";
import { ArrowRightIcon } from "lucide-react";

const Index = () => {
  return (
    <main>
      <Hero />
      <Marquee />
      <FeatureSection
        title={
          <span className="flex items-center gap-2 text-xl font-bold">
            Continue browsing
            <ArrowRightIcon />
          </span>
        }
      />
      <Section
        title={
          <span>
            Most Popular in{" "}
            <Link to={"/"} className="text-blue-600">
              Plumbing
            </Link>
          </span>
        }
      />
      <Section title={"Services you may need"} />
    </main>
  );
};

export default Index;
