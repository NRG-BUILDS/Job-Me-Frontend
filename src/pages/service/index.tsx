import StarRating from "@/components/skills-ui/star-rating";
import BacktoTopButton from "@/components/ui/back-to-top-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Image } from "@/components/ui/image";
import ScrollToTop from "@/hooks/scroll-to-top";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  Star,
} from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SendFirstMessage from "./send-message";
import useRequest from "@/hooks/use-request";
import { ServiceDetails } from "@/types/service";
import ReviewType from "@/types/reviews";

const ServicePage = () => {
  const { id } = useParams();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [sendMessageModal, setSendMessageModal] = useState(false);
  const { makeRequest, loading, error } = useRequest(`services/service/${id}`);

  const [service, setService] = useState<ServiceDetails | null>(null);

  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const {
    makeRequest: getReviews,
    loading: getReviewsLoading,
    error: getReviewsError,
  } = useRequest(`reviews/${id}`);

  useEffect(() => {
    makeRequest()
      .then((res) => setService(res.service))
      .catch((err) => {
        setService(null);
      });
    getReviews()
      .then((res) => setReviews(res.reviews))
      .catch((err) => {
        setReviews([]);
      });
  }, [id]);
  useLayoutEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  ScrollToTop();

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

  if (loading) return <ServicePageSkeleton />;
  if (error || !service) return <p>Error loading service</p>;

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
          <div className="flex items-center gap-1 text-sm text-link">
            <span>{service.category.name}</span>
            <ChevronRight className="text-border" />{" "}
            <span>
              {
                service.category.subcategories.find(
                  (cat) => cat.slug === service.subcategory,
                ).name
              }
            </span>
          </div>
          <h1 className="text-3xl font-bold">{service.title}</h1>
          <div className="flex items-start gap-3 lg:items-center">
            <div className="mt-1 size-8 overflow-clip rounded-full bg-blue-400 lg:mt-0">
              <Image src="" />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 font-semibold">
              <span className="font-medium">{service.artisan.username}</span>
              <span className="text-primary">Level 2 Artisan</span>
              <StarRating rating={service.rating_average} showRating />
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
                {service.gallery.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image src={image.url} alt="Hairdresser" />
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
              <p>{service.description}</p>
            </div>
          </section>
          <section id="about-artisan" className="px-4 py-5 lg:px-0">
            <h2 className="mb-4 text-xl font-bold">About Artisan</h2>
            <div className="mb-4 flex items-start gap-6">
              <div className="size-50 aspect-square min-w-20 overflow-clip rounded-full">
                <Image src="" />
              </div>
              <div className="grid gap-1">
                <p className="font-bold">
                  {service.artisan.first_name + " " + service.artisan.last_name}
                </p>
                <p>Auto Repair Specialist</p>
                <div className="flex items-center gap-1">
                  <StarRating rating={service.rating_average} showRating />
                  <div className="font-medium">
                    <span>({service.rating_average})</span>
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
                <p>
                  {service.artisan.profile?.city +
                    ", " +
                    service.artisan.profile?.state}
                </p>

                <p>{service.artisan.profile?.phone_number}</p>

                <Link
                  to={`mailto:${service.artisan.email}`}
                  className="block hover:underline"
                >
                  {service.artisan.email}
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
                {service.faq.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
          <section id="reviews">
            <ServiceReviews
              loading={getReviewsLoading}
              error={getReviewsError}
              reviews={reviews}
              ratingAverage={service.rating_average}
              totalReviews={service.reviews_count}
            />
          </section>
        </div>
        <div className="w-full items-start justify-end space-y-5 px-4 lg:col-span-5 lg:flex lg:p-0">
          <section className="sticky top-10 w-full max-w-[415px] space-y-6 border border-border text-lg">
            <div className="grid grid-cols-3 divide-x border-b border-border bg-muted font-bold">
              <div className="size-full bg-white p-5 py-3 text-primary hover:bg-muted">
                Offerings
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="divide-y *:flex *:items-center *:justify-between *:py-5">
                {service.offerings.map((o, i) => (
                  <div key={i} className="font-medium">
                    <p>{o.title}</p>
                    <span>₦{o.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-3 text-center">
                <Button
                  onClick={() => setSendMessageModal(true)}
                  className="w-full"
                  size="lg"
                >
                  Place an Order
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
        artisanId={service.artisan._id}
        offerings={service.offerings}
        serviceId={service._id}
        serviceTitle={service.title}
      />
    </section>
  );
};

export default ServicePage;

const ServiceReviews = ({
  reviews,
  loading,
  error,
  ratingAverage,
  totalReviews,
}: {
  reviews: ReviewType[];
  loading: boolean;
  error: string | null;
  ratingAverage: number;
  totalReviews: number;
}) => {
  // Calculate rating distribution
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const RatingDistribution = () => {
    return (
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Customer Reviews
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Math.round(ratingAverage)} size="w-5 h-5" />
              <span className="text-lg font-medium text-gray-900">
                {ratingAverage.toFixed(1)}
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
  const ReviewCard = ({ review }: { review: ReviewType }) => {
    const formatDate = (dateString: string) => {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground/20 font-medium text-dark">
              {review.reviewer.first_name[0] + review.reviewer.last_name[0]}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {review.reviewer.username}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(review.updated_at)}
              </p>
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
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.reviewer._id} review={review} />
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircleMore />
                </EmptyMedia>
                <EmptyTitle>No Reviews on the Service Yet</EmptyTitle>
                <EmptyDescription>
                  There are no reviews for this service yet. Place a booking and
                  be the first to review it.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

const ServicePageSkeleton = () => {
  return (
    <section className="relative">
      {/* Sticky Nav */}
      <nav className="sticky top-16 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex space-x-8 overflow-x-auto px-4 md:max-w-screen-2xl md:px-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-none" />
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-screen-xl gap-x-20 gap-y-4 p-0 lg:grid-cols-12 lg:p-6 xl:px-12">
        {/* Header */}
        <div className="col-span-full space-y-3 px-4 lg:p-0">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-8 w-2/3" />

          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-7">
          {/* Carousel */}
          <Skeleton className="aspect-video w-full lg:rounded-xl" />

          {/* Description */}
          <section className="space-y-3 px-4 py-5 lg:px-0">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </section>

          {/* About Artisan */}
          <section className="space-y-6 px-4 py-5 lg:px-0">
            <Skeleton className="h-6 w-48" />

            <div className="flex items-start gap-6">
              <Skeleton className="size-24 rounded-full" />

              <div className="w-full space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-4 h-10 w-40" />
              </div>
            </div>

            <div className="space-y-4 rounded border p-4 lg:p-6">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="space-y-4 px-4 py-5 lg:px-0">
            <Skeleton className="h-6 w-32" />

            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-11/12" />
              </div>
            ))}
          </section>

          {/* Reviews */}
          <section className="space-y-4 px-4 py-5 lg:px-0">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full items-start justify-end space-y-5 px-4 lg:col-span-5 lg:flex lg:p-0">
          <section className="sticky top-10 w-full max-w-[415px] space-y-6 border border-border">
            {/* Tabs */}
            <div className="grid grid-cols-3 divide-x border-b">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>

            <div className="space-y-6 p-5 pt-0">
              {/* Offerings */}
              <div className="divide-y">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-5"
                  >
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="mx-auto h-5 w-40" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
