import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // On mount, check saved preference
  useEffect(() => {
    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // localStorage.setItem("dark-mode", !darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform duration-300 z-50"
      title="Toggle Dark Mode"
    >
      {darkMode ? "🌞" : "🌙"}
    </button>
  );
}
