"use client";
import UpdatePasswordForm from "@/components/form/UpdatePasswordForm";
import React from "react";

const UpdatePasswordPage: React.FC = () => {
  return (
    <main className="w-full h-fit container p-4 flex flex-col lg:gap-6 gap-4 md:py-4">
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center lg:px-2"
      >
        <h1 className="lg:text-2xl text-xl font-bold">Update Password</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Update your password to keep your account secure and up to date.
        </p>
      </div>

      <UpdatePasswordForm />
    </main>
  );
};

export default UpdatePasswordPage;
