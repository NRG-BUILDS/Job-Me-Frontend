import StarRating from "@/components/skills-ui/star-rating";
import BacktoTopButton from "@/components/ui/back-to-top-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Image } from "@/components/ui/image";
import ScrollToTop from "@/hooks/scroll-to-top";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SendFirstMessage from "./send-message";

const ServicePage = () => {
  const { id } = useParams();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [sendMessageModal, setSendMessageModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  ScrollToTop();

  const handleBookClick = (i: number) => {
    navigate(`/service/${id}/book`, { state: { i } });
  };

  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "description", label: "Description" },
    { id: "about-artisan", label: "About Artisan" },
    { id: "faqs", label: "FAQs" },
    { id: "reviews", label: "Reviews" },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section is 20% from top
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for sticky nav height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative">
      <nav className="sticky top-16 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex space-x-8 overflow-x-auto px-4 md:max-w-screen-2xl md:px-12">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-colors duration-200 ${
                activeSection === section.id
                  ? "border-primary font-bold"
                  : "border-transparent text-border text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="mx-auto grid max-w-screen-xl gap-x-20 gap-y-4 p-0 lg:grid-cols-12 lg:p-6 xl:px-12">
        <div
          id="overview"
          className="col-span-full space-y-2 px-4 font-medium lg:p-0"
        >
          <div className="text-link flex items-center gap-1 text-sm">
            <span>Auto Repair</span>
            <ChevronRight className="text-border" /> <span>Auto Cooling </span>
          </div>
          <h1 className="text-3xl font-bold">
            I will install your sinks and water closet professionally
          </h1>
          <div className="flex items-start gap-3 lg:items-center">
            <div className="mt-1 size-8 overflow-clip rounded-full bg-blue-400 lg:mt-0">
              <Image src="" />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 font-semibold">
              <span className="font-medium">airb123</span>
              <span className="text-primary">Level 2 Artisan</span>
              <StarRating rating={4} showRating />
            </div>
          </div>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <div className="relative w-full">
            <Carousel
              setApi={setApi}
              className="aspect-video w-full overflow-clip lg:rounded-xl"
            >
              <CarouselContent>
                {[...Array(3)].map((_, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src="https://www.apprenticeship.ng/wp-content/uploads/2020/03/hairdresser-attribution-in-picassa.jpg"
                      alt="Hairdresser"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* Custom Arrows */}
            <Button
              onClick={() => api?.scrollPrev()}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            >
              <ChevronLeft size={40} />
            </Button>
            <Button
              onClick={() => api?.scrollNext()}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            >
              <ChevronRight size={40} />
            </Button>

            <div className="absolute right-2 top-2 z-10 rounded-md bg-white/20 p-2 px-4 text-white backdrop-blur-sm hover:bg-white/30">
              {current + 1} / {count}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    current === i ? "bg-white" : "bg-gray-400"
                  }`}
                  onClick={() => api?.scrollTo(i)}
                />
              ))}
            </div>
          </div>
          <section id="description" className="px-4 py-5 lg:px-0">
            <h2 className="mb-2 text-xl font-bold lg:mb-4">Description</h2>
            <div className="space-y-4">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
                doloribus repudiandae corrupti illo, nesciunt sed! Est ea culpa
                totam numquam, atque voluptatibus voluptate magnam commodi
                architecto, non illum, sunt praesentium?
              </p>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
                doloribus repudiandae corrupti illo, nesciunt sed! Est ea culpa
                totam numquam, atque voluptatibus voluptate magnam commodi
                architecto, non illum, sunt praesentium?
              </p>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
                doloribus repudiandae corrupti illo, nesciunt sed! Est ea culpa
                totam numquam.
              </p>
            </div>
          </section>
          <section id="about-artisan" className="px-4 py-5 lg:px-0">
            <h2 className="mb-4 text-xl font-bold">About Artisan</h2>
            <div className="mb-4 flex items-start gap-6">
              <div className="size-50 aspect-square min-w-20 overflow-clip rounded-full">
                <Image src="" />
              </div>
              <div className="grid gap-1">
                <p className="font-bold">Adebayo Cooling</p>
                <p>Auto Repair Specialist</p>
                <div className="flex items-center gap-1">
                  <StarRating rating={3.9} showRating />
                  <div className="font-medium">
                    <span>(39)</span>
                  </div>
                </div>
                <div className="mt-5">
                  <Button variant="outline" size="lg">
                    Contact Me
                  </Button>
                </div>
              </div>
            </div>
            <div className="sticky top-10 space-y-6 rounded border border-border p-4 lg:p-6">
              <div className="grid grid-cols-2 border-b pb-4 *:pb-4">
                <div className="grid">
                  <span>From:</span>
                  <span className="font-semibold">Ibadan, Oyo State</span>
                </div>
                <div className="grid">
                  <span>Member since:</span>
                  <span className="font-semibold">August, 2025</span>
                </div>
                <div className="grid">
                  <span>Work experience:</span>
                  <span className="font-semibold">4 years</span>
                </div>
                <div className="grid">
                  <span>Last delivery:</span>
                  <span className="font-semibold">about 2 days ago</span>
                </div>
                <div className="grid">
                  <span>Languages:</span>
                  <span className="font-semibold">English, Yoruba</span>
                </div>
              </div>
              <div className="space-y-3">
                <p>12, Adamu Musa Street, Epetun, Lagos Island</p>

                <p>0703 354 0006, 0905 223 446</p>

                <Link
                  to={"mailto:ajanlekok@salon.de"}
                  className="block hover:underline"
                >
                  ajanlekok@salon.de
                </Link>
              </div>
            </div>
          </section>

          <section id="faqs" className="px-4 py-5 lg:px-0">
            <h2 className="mb-2 text-xl font-bold lg:mb-4">FAQs</h2>
            <div className="space-y-4">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Do you work on AC for buses too?
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>Yes we do offer services for all vehicle types</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How fast in expected time of delivery
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                      All orders are carefully handled. We claim between 2 to 3
                      days on work
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Return Policy</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                      We stand behind our products with a comprehensive 30-day
                      return policy. If you&apos;re not completely satisfied,
                      simply return the item in its original condition.
                    </p>
                    <p>
                      Our hassle-free return process includes free return
                      shipping and full refunds processed within 48 hours of
                      receiving the returned item.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
          <section id="reviews">
            <ServiceReviews />
          </section>
        </div>
        <div className="w-full items-start justify-end space-y-5 px-4 lg:col-span-5 lg:flex lg:p-0">
          <section className="sticky top-10 w-full max-w-[415px] space-y-6 border border-border text-lg">
            <div className="grid grid-cols-3 divide-x border-b border-border bg-muted font-bold">
              <button className="size-full bg-white p-5 text-primary hover:bg-muted">
                Offering
              </button>
              <button className="size-full p-5 hover:bg-muted">Offering</button>
            </div>
            <div className="p-5 pt-0">
              <div className="divide-y *:flex *:items-center *:justify-between *:py-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="font-medium">
                    <p>AC Servicing</p>
                    <span>₦20,000</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-3 text-center">
                <Button
                  onClick={() => setSendMessageModal(true)}
                  className="w-full"
                  size="lg"
                >
                  Send a Message
                </Button>

                <Button
                  onClick={() => scrollToSection("about-artisan")}
                  variant="link"
                  className="text-primary underline"
                >
                  See other contact details
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <BacktoTopButton />
      <SendFirstMessage
        open={sendMessageModal}
        onChange={setSendMessageModal}
      />
    </section>
  );
};

export default ServicePage;

const ServiceReviews = () => {
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      review:
        "Absolutely fantastic service! The team was professional, timely, and exceeded all my expectations. I couldn't be happier with the results and would definitely recommend to anyone looking for quality work.",
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      date: "2024-01-12",
      review:
        "Great experience overall. The service was delivered on time and met most of my requirements. There were a few minor issues but nothing that couldn't be resolved quickly.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      date: "2024-01-10",
      review:
        "Outstanding quality and attention to detail. The communication throughout the process was excellent, and the final result was exactly what I was hoping for.",
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 3,
      date: "2024-01-08",
      review:
        "Decent service, though there's room for improvement. The work was completed satisfactorily but took longer than expected. Customer service was responsive when issues arose.",
    },
    {
      id: 5,
      name: "Lisa Park",
      rating: 5,
      date: "2024-01-05",
      review:
        "Exceptional service from start to finish! Professional, reliable, and the quality exceeded my expectations. Will definitely be using this service again.",
    },
    {
      id: 6,
      name: "James Wilson",
      rating: 4,
      date: "2024-01-03",
      review:
        "Very satisfied with the service provided. The team was knowledgeable and helpful throughout the process. Minor delays but overall a positive experience.",
    },
  ];

  // Calculate rating distribution
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  // Progress bar for rating distribution
  const RatingDistribution = () => {
    return (
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Customer Reviews
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} size="w-5 h-5" />
              <span className="text-lg font-medium text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500">({totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex min-w-0 items-center gap-1">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="min-w-0 text-sm text-gray-600">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Individual review component
  const ReviewCard = ({ review }) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div className="bg-white py-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
              {review.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{review.name}</h4>
              <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
        <p className="leading-relaxed text-gray-700">{review.review}</p>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-0">
      <RatingDistribution />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Recent Reviews</h3>
        <div className="divide-y">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};
