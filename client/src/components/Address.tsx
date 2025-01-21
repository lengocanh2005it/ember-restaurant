import React from "react";
import {
  MailIcon,
  MapPinIcon,
  NotebookIcon,
  PhoneCallIcon,
} from "lucide-react";

const address = [
  {
    icon: <MapPinIcon />,
    content: "123 Main Street, London, United Kingdom",
    title: "Address",
  },
  { icon: <PhoneCallIcon />, content: "0393873630", title: "Phone" },
  {
    icon: <MailIcon />,
    content: "ember01@gmail.com.uk",
    title: "Email",
  },
  {
    icon: <NotebookIcon />,
    content: "ember01@yahoo.com.uk",
    title: "Yahoo",
  },
];

const Address: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 border border-white/20 rounded-[20px] relative py-6 px-4">
      {address.map((address, index) => {
        return (
          <div
            key={index}
            className="flex flex-col gap-2 p-3 border border-white/30 rounded-[20px]
            transition-all duration-300 hover:border-white 
             cursor-pointer text-white/50 hover:text-white"
          >
            <div className="flex items-center gap-1">
              <p className="text-2xl">{address.icon}</p>
              <p>{address.title}</p>
            </div>
            <p className="font-bold text-white">{address.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Address;
