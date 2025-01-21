"use client";
import { Label } from "@/components/ui/label";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { motion } from "framer-motion";

const ratings = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
];

const FeedbackForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.2,
          duration: 1,
          ease: "easeInOut",
        },
      }}
      className="relative xl:w-[45%] w-full h-full"
    >
      <form
        className="w-full h-full relative p-4 flex flex-col gap-3 border border-white/30
          rounded-[15px]"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            placeholder="Your name..."
            className="w-full text-black"
            id="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Your email..."
            className="w-full text-black"
            id="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            placeholder="Your phone..."
            className="w-full text-black"
            id="phone"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Visit date</Label>

          <DatePicker isRequired aria-labelledby="date" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Number Rating</Label>

          <Select placeholder="Select number rating" className="text-black">
            {ratings.map((rating) => (
              <SelectItem key={rating.key} className="text-black">
                {rating.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="feedback">Feedback</Label>
          <Textarea
            placeholder="Your feedback..."
            className="w-full text-black"
            id="feedback"
          />
        </div>

        <Button
          color="secondary"
          className="bg-white text-black w-fit mx-auto
           px-8 text-base"
        >
          Submit
        </Button>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
