"use client";
import BannerNotFound from "@/components/BannerNotFound";
import { Button } from "@heroui/react";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home");
  };

  return (
    <main
      className="w-full lg:px-6 lg:py-8 px-2 py-4 container mx-auto flex items-center justify-center
     flex-col gap-3"
    >
      <BannerNotFound />

      <div
        className="relative container lg:gap-5 gap-2 mx-auto lg:px-5 px-2 flex flex-col items-center 
        text-center lg:h-[80vh] justify-center"
      >
        <div className="relative lg:w-[500px] lg:h-[500px] w-[350px] h-[350px]">
          <Image
            src={"/unauthorized-1.png"}
            alt=""
            priority
            fill
            sizes="(max-width:600px) 100vw, 50vw"
            className="object-cover select-none"
          />
        </div>

        <div className="flex flex-col gap-2 items-center text-center">
          <h1 className="lg:text-2xl text-xl uppercase font-bold">
            Access Denied
          </h1>

          <p className="lg:text-base text-[14px] text-white/70">
            You don&apos;t have permission to access this page!
          </p>
        </div>

        <Button
          className="dark:bg-white dark:text-black bg-white text-black"
          onPress={handleClick}
          startContent={<HomeIcon />}
        >
          Back to Home
        </Button>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
