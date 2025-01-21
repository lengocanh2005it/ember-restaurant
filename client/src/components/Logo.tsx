"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div className="flex gap-3 items-center text-center xl:justify-center justify-end">
      <Image
        src="/ember_logo.png"
        alt=""
        sizes="(max-width: 600px) 100vw, 50vw"
        priority
        width={80}
        height={80}
        className="rounded-full select-none cursor-pointer object-cover"
        onClick={() => {
          router.push("/");
        }}
      />
      <h1 className="font-bold text-3xl">Ember.</h1>
    </div>
  );
};

export default Logo;
