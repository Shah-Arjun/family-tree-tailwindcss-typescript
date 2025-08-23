// DarkModeToggleButton.tsx
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggleButton() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Check system preference or saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Don’t render until theme is loaded (avoids flicker)
  if (isDark === null) return null;

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-all duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
