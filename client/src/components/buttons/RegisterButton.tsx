"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

const RegisterButton: React.FC = () => {
  return (
    <Link href="/register">
      <Button
        className={`px-8 py-4 
         text-white font-bold border border-white/30 hover:bg-white/30 text-base`}
        variant="bordered"
      >
        Register
      </Button>
    </Link>
  );
};

export default RegisterButton;
