"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google";
import bgBlack from "@/assets/bg_black.jpeg";
import logoSingle from "@/assets/logo_single.png";

export default function SigninPage() {
  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="relative flex items-center justify-center py-12 h-screen lg:h-auto isolate">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="flex justify-center">
            <Image
              src={logoSingle}
              alt="logo"
              className="w-44 md:w-60 lg:w-auto"
            />
          </div>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                signIn("google", { redirect: true, callbackUrl: "/search" })
              }
            >
              <GoogleIcon className="mr-6 h-6 w-6" /> Login with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={bgBlack}
          alt="Image"
          className="object-cover w-full lg:max-h-screen"
        />
      </div>
    </div>
  );
}
