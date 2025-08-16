// DarkModeToggleButton.tsx
import { useEffect, useState } from "react";


export default function DarkModeToggleButton() {
  const [isDark, setIsDark] = useState(false);

  // Load saved preference or system default
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
