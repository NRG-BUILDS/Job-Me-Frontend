import { useState, useEffect } from "react";

const AppearanceProvider = () => {
  const [appearance, setAppearance] = useState(() => {
    const savedAppearance = localStorage.getItem("appearance");
    return savedAppearance ? JSON.parse(savedAppearance) : {};
  });

  useEffect(() => {
    // set default appearance if not set
    if (Object.keys(appearance).length === 0) {
      const defaultAppearance = {
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
        animations: true,
        compactMode: false,
      };
      setAppearance(defaultAppearance);
      console.log("Default appearance applied.");
      return;
    }
    // Apply dark mode
    if (appearance.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (appearance.theme === "light") {
      document.documentElement.classList.remove("dark");
    }

    // Apply animations
    if (appearance.animations) {
      document.documentElement.classList.remove("no-animations");
    } else {
      document.documentElement.classList.add("no-animations");
    }

    // Apply compact mode
    if (appearance.compactMode) {
      document.documentElement.classList.add("compact-mode");
    } else {
      document.documentElement.classList.remove("compact-mode");
    }

    // Store settings in localStorage for persistence
    localStorage.setItem("appearance", JSON.stringify(appearance));
  }, [appearance]);

  return null; // This component doesn't render anything
};

export default AppearanceProvider;
