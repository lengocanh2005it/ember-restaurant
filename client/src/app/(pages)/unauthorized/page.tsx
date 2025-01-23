"use client";
import BannerNotFound from "@/components/BannerNotFound";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home");
  };

  return (
    <main className="w-full px-6 py-4 container mx-auto flex items-center justify-center flex-col gap-3">
      <BannerNotFound />

      <div className="relative container gap-4 mx-auto px-5 flex flex-col items-center text-center lg:h-[80vh] justify-center">
        <div className="relative lg:w-[300px] lg:h-[300px] w-[350px] h-[350px]">
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
            Unauthorized
          </h1>

          <p className="lg:text-[14px] text-[13px] text-white/50">
            You don&apos;t have permission to access this page!
          </p>
        </div>

        <Button
          className="dark:bg-white dark:text-black uppercase bg-white text-black"
          onPress={handleClick}
        >
          Home
        </Button>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
