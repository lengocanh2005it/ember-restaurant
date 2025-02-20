"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout } from "@/hooks/use-logout";
import { useAppStore, useUserStore } from "@/store";
import {
  LockIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const { isAdmin } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  const { mutate: mutateLogout } = useLogout();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const options = [
    { name: "View profile", icon: <UserIcon />, path: "/home/profile" },
    ...(!isAdmin
      ? [{ name: "Your cart", icon: <ShoppingCartIcon />, path: "/home/cart" }]
      : []),
    {
      name: "Settings",
      icon: <SettingsIcon />,
      path: "/home/settings",
    },
    ...(isAdmin
      ? [{ name: "Admin page", icon: <ShieldIcon />, path: "/home/admin" }]
      : []),
    { name: "Log out", icon: <LogOutIcon /> },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex items-center cursor-pointer rounded-md
         dark:bg-primary dark:text-white w-fit"
        >
          {user && user.image && (
            <Image
              src={user.image}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full cursor-pointer select-none object-cover"
            />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="xl:w-[300px] md:w-20 w-60 p-4 
      shadow-lg rounded-lg md:mr-2 md:-ml-10 ml-2"
      >
        <div className="gap-2 grid">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {user?.name ? user?.name : user?.username}
              {isAdmin && (
                <>
                  &nbsp;
                  <span className="dark:text-white/70 text-black/70">
                    (Admin)
                  </span>
                </>
              )}
            </h4>
            <p className="text-sm dark:text-white/70 text-black/70">
              {user?.job ? user?.job : "Job: None"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {options.map((option, index) => {
              return (
                <div
                  className="flex items-center justify-center gap-2 hover:bg-[#f2f2f2]
                   dark:hover:bg-[#4a4a4a] p-1
            cursor-pointer group rounded-[25px] border border-black/10 dark:border-white/20"
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    {
                      !option.path ? mutateLogout() : router.push(option.path);
                    }
                  }}
                >
                  {option.icon}
                  <p>{option.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
