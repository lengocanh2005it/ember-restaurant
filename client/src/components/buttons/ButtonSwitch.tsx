"use client";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { useSwitchTheme } from "@/hooks/use-switch-theme";
import { useAppStore } from "@/store";
import { Switch } from "@heroui/react";
import { useEffect } from "react";

export default function ButtonSwitch() {
  const { isDarkMode, setIsDarkMode, setTheme } = useAppStore();

  const { mutate: mutateSwitchTheme } = useSwitchTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);

    setTheme(isDarkMode === true ? "dark" : "light");

    if (isDarkMode) {
      mutateSwitchTheme({ theme: "light" });
    } else {
      mutateSwitchTheme({ theme: "dark" });
    }
  };

  return (
    <Switch
      isSelected={isDarkMode}
      defaultSelected
      onChange={handleToggle}
      size="lg"
      color="secondary"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <MoonIcon className={className} />
        ) : (
          <SunIcon className={className} />
        )
      }
    />
  );
}
