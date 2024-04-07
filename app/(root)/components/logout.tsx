"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <DropdownMenuItem
      onClick={() => signOut({ redirect: true, callbackUrl: "/signin" })}
    >
      Logout
    </DropdownMenuItem>
  );
}
