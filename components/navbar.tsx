"use client";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="destructive"
            onClick={() =>
              signOut({ redirect: true, callbackUrl: "/admin/signin" })
            }
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
