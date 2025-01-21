import CreateEventForm from "@/components/form/CreateEventForm";
import React from "react";

const AddEventPage: React.FC = () => {
  return (
    <section className="relative container mx-auto lg:px-4 py-6 flex flex-col lg:gap-6 gap-4">
      <div
        className="relative flex flex-col lg:text-base text-[14px] lg:text-left
       text-center lg:items-start items-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          Create A New Event
        </h1>

        <p className="lg:text-base text-[15px] dark:text-white/70 text-black/80">
          Let&apos;s create a new event to notify the customers right away.
        </p>
      </div>

      <CreateEventForm />
    </section>
  );
};

export default AddEventPage;
