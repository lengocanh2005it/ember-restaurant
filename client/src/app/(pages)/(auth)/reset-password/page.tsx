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
      <div className="container mx-auto w-full text-base h-screen">
        <Header />

        <div className="py-14 lg:px-8 container flex flex-col gap-4">
          <h1 className="lg:text-2xl text-xl font-bold uppercase">
            Reset Password
          </h1>

          <ResetPasswordForm token={resetToken} />
        </div>
      </div>
    </React.Suspense>
  );
};

export default ResetPasswordPage;
