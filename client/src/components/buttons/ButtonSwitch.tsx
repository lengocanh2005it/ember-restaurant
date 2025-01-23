"use client";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { useProfile } from "@/hooks/use-profile";
import { handleSwitchTheme } from "@/lib/theme";
import { useAppStore } from "@/store";
import { Switch } from "@heroui/react";
import { useEffect } from "react";

export default function ButtonSwitch() {
  const { isDarkMode, setIsDarkMode, setTheme } = useAppStore();

  const { data: profile, refetch } = useProfile();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (profile) {
      setIsDarkMode(profile.theme === "light" ? false : true);
    }
  }, [setIsDarkMode, profile]);

  const handleToggle = async () => {
    setIsDarkMode(!isDarkMode);

    if (isDarkMode && localStorage.getItem("accessToken")) {
      setTheme("light");
      await handleSwitchTheme({ theme: "light" });
    } else {
      setTheme("dark");
      await handleSwitchTheme({ theme: "dark" });
    }
    refetch();
  };

  return (
    <>
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
    </>
  );
}
