"use client";
import { Label } from "@/components/ui/label";
import { Button, Input, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";

const inputs = [
  { id: 1, label: "First name", placeholder: "First name..." },
  { id: 2, label: "Last name", placeholder: "Last name..." },
  { id: 3, label: "Phone number", placeholder: "Phone number..." },
  { id: 4, label: "Email address", placeholder: "Email address..." },
  { id: 5, label: "Position", placeholder: "Enter position that you want..." },
  { id: 6, label: "About you", placeholder: "Describe you..." },
];

interface CareerFormProps {
  formControlStyle: string;
  labelStyle: string;
  inputStyle: string;
  textAreaStyle: string;
}

const CareerForm: React.FC<CareerFormProps> = ({
  formControlStyle,
  labelStyle,
  inputStyle,
  textAreaStyle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          delay: 0.8,
          duration: 1.6,
          ease: "easeInOut",
        },
      }}
      className="xl:w-[45%] w-full p-4 border
       border-white/30 rounded-[15px] relative
       order-2 xl:order-none"
    >
      <form className="h-fit flex flex-col justify-between gap-3 xl:gap-1">
        <div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-5">
          {inputs.map((input) => (
            <div key={input.id} className={formControlStyle}>
              <Label htmlFor={input.label} className={labelStyle}>
                {input.label}
              </Label>

              {input.id !== 6 ? (
                <Input
                  type="text"
                  name=""
                  id=""
                  placeholder={input.placeholder}
                  className={inputStyle}
                />
              ) : (
                <Textarea
                  type="text"
                  name=""
                  id=""
                  placeholder={input.placeholder}
                  className={textAreaStyle}
                />
              )}
            </div>
          ))}
        </div>

        <Button className="bg-white text-black w-fit mx-auto px-6">
          Submit
        </Button>
      </form>
    </motion.div>
  );
};

export default CareerForm;
