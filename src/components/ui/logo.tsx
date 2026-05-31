import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import logo from "@/assets/brand/Job&Me.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const [variant, setVariant] = useState<"light" | "dark">("light"); // Default to light

  useEffect(() => {
    // Check the theme after mounting
    setVariant(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );

    const observer = new MutationObserver(() => {
      setVariant(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
      console.log(document.documentElement.classList);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const sizeClasses = {
    sm: "w-24",
    md: "w-32",
    lg: "w-36",
    xl: "w-48",
  };

  return (
    <>
      <div className={cn("", sizeClasses[size], className)}>
        <img src={logo} alt="Job&Me" className="h-full w-full object-cover" />
      </div>
    </>
  );
}
