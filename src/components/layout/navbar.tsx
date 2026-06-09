import { useState, useEffect, JSXElementConstructor, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  House,
  LayoutDashboard,
  LogIn,
  LogOut,
  LucideLogIn,
  LucideSearch,
  LucideUser,
  LucideUser2,
  Megaphone,
  Menu,
  MessageSquareText,
  Phone,
  Search,
  User2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Input } from "../ui/input";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchbarOpen, setIsMobileSearchbarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const boundary = isMobile ? 20 : 50;
      setIsScrolled(window.scrollY > boundary);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks: NavItem[] = [
    { label: "Home", href: "/", icon: <House /> },
    isAuthenticated &&
      user.is_artisan && {
        label: "Artisan Dashboard",
        href: "/artisan/dashboard",
        icon: <LayoutDashboard />,
      },
    isAuthenticated &&
      user && {
        label: "Messages",
        href: "/chats",
        icon: <MessageSquareText />,
      },
    { label: "Orders", href: "/profile/orders", icon: <Phone /> },

    { label: "Profile", href: "/profile", icon: <User2 /> },
    !isAuthenticated && {
      label: "Login",
      href: "/auth/login",
      icon: <LogIn />,
    },
    ,
  ].filter(Boolean);

  return (
    <header
      className={cn(
        "sticky left-0 right-0 top-0 z-50 h-16 px-2 transition-all duration-300 ease-in-out md:px-12",
        isScrolled
          ? "glass-light dark:glass py-2"
          : "border-b bg-transparent py-3",
      )}
    >
      {/* Desktop Navigation */}
      <div className="mx-auto md:max-w-screen-2xl">
        <div className="group flex items-center justify-between gap-4">
          <Link to="/" className="z-50 hidden w-1/4 md:block">
            <Logo size="xl" />
          </Link>
          <Link to="/" className="z-50 block w-1/4 md:hidden">
            <Logo size="md" />
          </Link>

          <div className="hidden w-full max-w-xl md:block">
            <Searchbar />
          </div>

          <div className="hidden w-1/4 items-center justify-end space-x-6 md:flex">
            {isAuthenticated ? (
              <>
                <Link to={""}>
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2108_868)">
                      <g clip-path="url(#clip1_2108_868)">
                        <path
                          d="M0.937012 9.75098V14.251C0.93725 14.6487 1.09542 15.0301 1.37676 15.3113C1.65809 15.5924 2.03956 15.7504 2.43731 15.7504H15.9373C16.1343 15.7505 16.3294 15.7118 16.5114 15.6365C16.6934 15.5612 16.8588 15.4508 16.9981 15.3115C17.1375 15.1723 17.248 15.007 17.3234 14.825C17.3988 14.643 17.4376 14.448 17.4376 14.251V9.75098"
                          stroke="#74767E"
                          stroke-width="1.8"
                          stroke-miterlimit="10"
                          stroke-linecap="square"
                        />
                        <path
                          d="M17.4376 6.0003V3.7503C17.4376 3.3524 17.2795 2.97079 16.9982 2.68943C16.7168 2.40807 16.3352 2.25 15.9373 2.25H2.43731C2.03941 2.25 1.6578 2.40807 1.37644 2.68943C1.09508 2.97079 0.937012 3.3524 0.937012 3.7503V6.0003L9.18731 10.5003L17.4376 6.0003Z"
                          stroke="#74767E"
                          stroke-width="1.8"
                          stroke-miterlimit="10"
                          stroke-linecap="square"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_2108_868">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0.1875)"
                        />
                      </clipPath>
                      <clipPath id="clip1_2108_868">
                        <rect
                          width="18"
                          height="16.2"
                          fill="white"
                          transform="translate(0.1875 0.900391)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
                <Link to={""}>
                  <Heart size={18} />
                </Link>
                <Link
                  to={"/profile/orders"}
                  className="text-sm font-semibold hover:underline"
                >
                  Orders
                </Link>
                {user?.is_artisan && (
                  <Link
                    to={"/artisan/dashboard"}
                    className="whitespace-nowrap text-sm font-semibold text-primary hover:underline"
                  >
                    Artisan Dashboard
                  </Link>
                )}
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex size-8 items-center justify-center rounded-full bg-white leading-[0] shadow-lg"
                    >
                      {isAuthenticated ? (
                        <span>
                          {user?.first_name?.slice(0, 1).toUpperCase()}
                        </span>
                      ) : (
                        <LucideUser />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-fit overflow-clip p-0 *:flex *:items-center *:gap-2 *:p-3 hover:*:bg-neutral-100"
                  >
                    {isAuthenticated && (
                      <div className="flex items-center border-b">
                        <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-black">
                          <span className="font-semibold text-white">
                            {user?.first_name?.slice(0, 1)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h1 className="font-semibold capitalize text-gray-900">
                            {user?.first_name}
                          </h1>
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    )}
                    {navLinks.map((link) => (
                      <Link to={link.href}>
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <Link to={"/auth/signup"}>
                <Button variant="outline" className="rounded-full">
                  Create an Account
                </Button>
              </Link>
            )}
          </div>
          {/* Desktop Navigation End */}

          {/* Mobile Navigation Start */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Menu Toggle */}

            <div className="z-50 w-fit">
              <button
                onClick={() => setIsMobileSearchbarOpen(!isMobileSearchbarOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                <Search
                  className={`h-6 w-6 ${isMobileSearchbarOpen ? "text-primary" : ""}`}
                />
              </button>
            </div>
            <div className="z-50 w-fit">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                <User2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMobileSearchbarOpen && (
        <div className="mt-2 w-full md:hidden">
          <Searchbar autoFocus onBlur={() => setIsMobileSearchbarOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex flex-col bg-background px-6 pt-20 md:hidden"
          >
            <nav className="flex flex-col space-y-6 pt-8">
              <div className="flex flex-col space-y-4 pt-4">
                {isAuthenticated && (
                  <div className="flex items-center border-b py-2">
                    <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-black">
                      <span className="font-semibold text-white">
                        {user?.first_name?.slice(0, 1)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h1 className="font-semibold capitalize text-gray-900">
                        {user?.first_name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}
                {navLinks.map((link) => (
                  <Link
                    to={link.href}
                    className="block py-2 text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-full rounded-full"
                    >
                      <span>Log in</span> <LucideUser />
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;

type Props = {
  autoFocus?: boolean;
  onBlur?: () => void;
};
export const Searchbar = ({ onBlur, autoFocus = false }: Props) => {
  return (
    <div className="inline-flex w-full items-stretch">
      <input
        type="text"
        aria-label="Search"
        autoFocus={autoFocus}
        onBlur={onBlur}
        className="w-full border border-r-0 border-input px-4 outline-none focus:border-primary focus:ring-0"
        placeholder="What service do you need today?"
      />
      <button
        type="button"
        aria-label="Submit search"
        className="flex size-10 min-w-10 items-center justify-center bg-black text-white hover:bg-primary focus:outline-none"
      >
        {/* simple search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
          />
        </svg>
      </button>
    </div>
  );
};
