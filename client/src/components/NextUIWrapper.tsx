"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function NextUIWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
