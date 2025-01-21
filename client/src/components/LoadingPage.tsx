import React from "react";
import { Spinner } from "@nextui-org/react";

const LoadingPage: React.FC = () => {
  return (
    <div
      className="w-full h-screen container mx-0 flex flex-col
     items-center justify-center"
    >
      <Spinner label="Loading..." size="lg" color="danger" />
    </div>
  );
};

export default LoadingPage;
