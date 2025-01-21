import React from "react";
import { VscLocation, VscCallOutgoing, VscMail } from "react-icons/vsc";

const address = [
  { icon: <VscLocation />, content: "London, UK" },
  { icon: <VscCallOutgoing />, content: "(+54) 043 278 789" },
  { icon: <VscMail />, content: "ember01@gm.com.uk" },
];

const AddressFooter = ({ containerStyles }: { containerStyles: string }) => {
  return (
    <div className="mt-4">
      {address.map((element, index) => {
        return (
          <div key={index} className={containerStyles}>
            <p className="text-2xl">{element.icon}</p>
            <p>{element.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AddressFooter;
