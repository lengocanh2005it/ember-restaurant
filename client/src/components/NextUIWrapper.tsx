"use client";

import { HeroUIProvider } from "@heroui/react";

export default function NextUIWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
