"use client";
import Banner from "@/components/Banner";
import FeatureDishes from "@/components/FeatureDishes";
import LoadingPage from "@/components/LoadingPage";
import OrdersReservationsPoints from "@/components/OrdersAndReservations";
import OrdersReservationsPointsWithReview from "@/components/OrdersReservationsPointsWithReview";
import Promotions from "@/components/Promotions";
import CustomerReviews from "@/components/Reviews";
import UpcomingEvents from "@/components/UpcomingEvents";
import { useProfile } from "@/hooks/use-profile";
import { useAppStore, useUserStore } from "@/store";
import { JwtPayload, User } from "@/utils/types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

const HomePage: React.FC = () => {
  const { setIsDarkMode, setAccessToken, setIsAdmin, isAdmin, setTheme } =
    useAppStore();
  const { setUser } = useUserStore();

  const { data, isLoading, isError } = useProfile();

  const sections = [
    ...(!isAdmin
      ? [{ component: <OrdersReservationsPoints />, className: "" }]
      : []),
    { component: <FeatureDishes />, className: "" },
    { component: <Promotions />, className: "overflow-x-hidden" },
    {
      component: (
        <>
          <CustomerReviews />
          {!isAdmin && <OrdersReservationsPointsWithReview />}
        </>
      ),
      className: "overflow-x-hidden",
    },
    { component: <UpcomingEvents />, className: "" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;

      if (decodedToken?.roles) {
        const isAdminRole = decodedToken.roles.some((role) => role === "admin");
        setIsAdmin(isAdminRole);
      }

      setAccessToken(token);
    }
  }, [setAccessToken, setIsAdmin]);

  useEffect(() => {
    const theme = Cookies.get("theme");
    if (theme) {
      setIsDarkMode(theme === "light" ? false : true);
      setTheme(theme);
    }

    if (window.location.hash && window.location.hash === "#_=_") {
      if (window.history && window.history.pushState) {
        window.history.pushState("", document.title, window.location.pathname);
      } else {
        window.location.hash = "";
      }
    }
  }, [setTheme, setIsDarkMode]);

  useEffect(() => {
    if (data) {
      setUser(data as User);
      setIsDarkMode((data as User).theme === "light" ? false : true);
      setIsAdmin((data as User).roles.some((role) => role === "admin"));
    }
  }, [data, setUser, setIsAdmin, setIsDarkMode]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <React.Fragment>
      <main
        className="w-full h-fit bg-white text-black relative gap-4
       flex flex-col dark:text-white dark:bg-primary"
      >
        <Banner />

        {isAdmin && (
          <div
            className="relative flex flex-col gap-2 
          container mx-auto items-center justify-center text-center lg:h-[30vh] h-[20vh]"
          >
            <h1 className="lg:text-2xl text-xl uppercase font-bold">
              Manage Restaurant on Admin Page
            </h1>

            <p className="lg:text-xl text-base dark:text-white/70 text-black/70">
              Go to the Admin Page in the Profile section to adjust the
              restaurant&apos;s features.
            </p>
          </div>
        )}

        {sections.map((section, index) => {
          return (
            <section key={index} className={section.className}>
              {section.component}
            </section>
          );
        })}
      </main>
    </React.Fragment>
  );
};

export default HomePage;
