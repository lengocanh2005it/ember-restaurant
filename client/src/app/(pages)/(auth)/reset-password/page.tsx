"use client";
import React, { useEffect, useState, use } from "react";
import Header from "@/components/layouts/Header";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";
import LoadingPage from "@/components/LoadingPage";

const ResetPasswordPage: React.FC = (props: any) => {
  const searchParams = use(props.searchParams) as Record<string, string>;
  const [resetToken, setResetToken] = useState<string>("");

  useEffect(() => {
    const token = searchParams.token;
    if (token) {
      setResetToken(token);
    }
  }, [searchParams]);

  return (
    <React.Suspense fallback={<LoadingPage />}>
      <div className="container mx-auto w-full text-base">
        <Header />

        <div className="py-6 lg:px-8 container flex flex-col lg:gap-8 gap-6">
          <div
            className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center"
          >
            <h1 className="lg:text-2xl text-xl font-bold md:text-left text-center">
              Reset Password
            </h1>

            <p className="lg:text-base text-[14px] text-white/80">
              Please enter your new password and confirm it to reset your
              account password.
            </p>
          </div>

          <ResetPasswordForm token={resetToken} />
        </div>
      </div>
    </React.Suspense>
  );
};

export default ResetPasswordPage;
