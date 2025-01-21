import React from "react";

import Google from "@/components/ui/google";
import Facebook from "@/components/ui/facebook";
import { useRouter } from "next/navigation";

const buttons = [
  {
    icon: <Google />,
    link: "http://localhost:3001/api/v1/auth/google/login",
  },
  {
    icon: <Facebook />,
    link: "http://localhost:3001/api/v1/auth/facebook/login",
  },
];

const ButtonLoginOthers = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      {buttons.map((button, index) => {
        return (
          <button
            key={index}
            className="bg-white rounded-full p-1 ease-in-out duration-300 transition-all hover:bg-[#dedede]"
            onClick={() => {
              router.push(button.link);
            }}
            type="button"
          >
            {button.icon}
          </button>
        );
      })}
    </React.Fragment>
  );
};

export default ButtonLoginOthers;
