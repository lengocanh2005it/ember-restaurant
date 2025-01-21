"use client";
import React from "react";
import { Spinner } from "@nextui-org/react";

const LoadingComponent: React.FC = () => {
  return <Spinner label="Loading..." color="danger" size="lg" />;
};

export default LoadingComponent;
