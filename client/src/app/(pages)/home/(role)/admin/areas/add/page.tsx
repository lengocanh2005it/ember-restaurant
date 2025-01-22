import CreateAreaForm from "@/components/form/CreateAreaForm";
import ModalAddTable from "@/components/modal/ModalAddTable";
import React from "react";

const AddAreaPage: React.FC = () => {
  return (
    <main className="relative flex flex-col lg:gap-5 gap-3 lg:py-8 py-4 lg:px-6 px-4">
      <div className="relative flex lg:flex-row flex-col items-center lg:justify-between gap-2">
        <div className="relative flex flex-col lg:items-start items-center lg:text-left text-center">
          <h1 className="lg:text-2xl text-xl font-bold uppercase">
            Create New Area
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
            Add a new area to the system to manage and distribute resources or
            services efficiently.
          </p>
        </div>

        <ModalAddTable />
      </div>

      <CreateAreaForm />
    </main>
  );
};

export default AddAreaPage;
