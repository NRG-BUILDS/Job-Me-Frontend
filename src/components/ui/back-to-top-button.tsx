import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {}
const BacktoTopButton = ({}: Props) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll event to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 transform animate-slide-in-bottom rounded-full bg-secondary p-3 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default BacktoTopButton;
