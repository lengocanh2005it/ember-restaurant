"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface NextAuthSessionProviderProps {
  children: ReactNode;
}

const NextAuthSessionProvider: React.FC<NextAuthSessionProviderProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;
