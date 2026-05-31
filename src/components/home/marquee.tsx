import React from "react";
import Architect from "@/assets/images/hero-carousel/architect.jpeg";
import Builder from "@/assets/images/hero-carousel/builder.jpeg";
import Carpenter from "@/assets/images/hero-carousel/carpenter.jpeg";
import Electrician from "@/assets/images/hero-carousel/electrician.jpeg";
import Cobbler from "@/assets/images/hero-carousel/cobbler.jpeg";
import Plumber from "@/assets/images/hero-carousel/plumber.jpg";

const ModernMarquee = () => {
  // Sample data for the marquee boxes
  const items = [
    {
      id: 1,
      title: "Architecture",
      subtitle: "Ibadan",
      color: "from-blue-500 to-purple-600",
      image: Architect,
    },
    {
      id: 2,
      title: "Building",
      subtitle: "Ogun State",
      color: "from-pink-500 to-rose-600",
      image: Builder,
    },
    {
      id: 3,
      title: "Plumbing",
      subtitle: "Port harcourt",
      color: "from-green-500 to-teal-600",
      image: Plumber,
    },
    {
      id: 4,
      title: "Carpentry",
      subtitle: "Kaduna",
      color: "from-orange-500 to-red-600",
      image: Carpenter,
    },
    {
      id: 5,
      title: "Electrician",
      subtitle: "Lagos",
      color: "from-indigo-500 to-blue-600",
      image: Electrician,
    },
    {
      id: 6,
      title: "Cobbler",
      subtitle: "Abia",
      color: "from-purple-500 to-pink-600",
      image: Cobbler,
    },
  ];

  return (
    <div className="w-full overflow-hidden py-12 pt-6">
      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent"></div>

        {/* Marquee track */}
        <div className="animate-marquee flex">
          {/* First set of items */}
          {items.map((item) => (
            <div
              key={`first-${item.id}`}
              className="group relative mx-3 size-60 flex-shrink-0 cursor-pointer overflow-clip rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt=""
                className="absolute left-0 top-0 size-full"
              />
              <div
                className={`bg-gradient-to-brrelative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-4`}
              >
                {/* Background decoration */}
                <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 transform rounded-full bg-white bg-opacity-10"></div>
                <div className="absolute bottom-0 left-0 h-12 w-12 -translate-x-6 translate-y-6 transform rounded-full bg-white bg-opacity-10"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h3
                    className={`w-fit rounded-full bg-gradient-to-br p-1 ${item.color} px-2 text-xs font-bold leading-tight text-white`}
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-white text-opacity-90">
                    {item.subtitle}
                  </p>
                  <div className="mt-2 h-0.5 w-8 bg-white bg-opacity-60 transition-all duration-300 group-hover:w-12"></div>
                </div>
              </div>
            </div>
          ))}
          {/* Second set of items for seemless transiton */}
          {items.map((item) => (
            <div
              key={`first-${item.id}`}
              className="group relative mx-3 size-60 flex-shrink-0 cursor-pointer overflow-clip rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt=""
                className="absolute left-0 top-0 size-full"
              />
              <div
                className={`bg-gradient-to-brrelative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-4`}
              >
                {/* Background decoration */}
                <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 transform rounded-full bg-white bg-opacity-10"></div>
                <div className="absolute bottom-0 left-0 h-12 w-12 -translate-x-6 translate-y-6 transform rounded-full bg-white bg-opacity-10"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h3
                    className={`w-fit rounded-full bg-gradient-to-br p-1 ${item.color} px-2 text-xs font-bold leading-tight text-white`}
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-white text-opacity-90">
                    {item.subtitle}
                  </p>
                  <div className="mt-2 h-0.5 w-8 bg-white bg-opacity-60 transition-all duration-300 group-hover:w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* @ts-ignore */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ModernMarquee;
