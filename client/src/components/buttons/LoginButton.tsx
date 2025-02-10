"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const LoginButton: React.FC = () => {
  return (
    <Link href="/login">
      <Button
        className={`px-10 py-4 
         text-white font-bold border border-white/30 hover:bg-white/30 text-base`}
        variant="bordered"
      >
        Login
      </Button>
    </Link>
  );
};

export default LoginButton;
