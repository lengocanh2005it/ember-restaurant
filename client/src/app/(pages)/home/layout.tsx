import NavbarHome from "@/components/navbar/NavbarHome";
import NavbarHomeMobile from "@/components/navbar/NavbarHomeMobile";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white text-black dark:text-white dark:bg-primary">
      {/* Desktop navbar */}
      <div className="lg:block hidden">
        <NavbarHome />
      </div>

      {/* Mobile navbar */}
      <div className="lg:hidden block">
        <NavbarHomeMobile />
      </div>

      {children}
      <Toaster />
    </div>
  );
}
