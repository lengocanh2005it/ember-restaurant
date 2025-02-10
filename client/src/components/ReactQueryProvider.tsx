"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/config/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_GC_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
