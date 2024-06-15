// "use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      {children}
      <GoogleAnalytics gaId={process.env.GA_TRACKING_ID!} />
      <footer className="absolute bottom-0 w-full px-4 md:px-16 grid place-items-center h-10 md:h-16 text-slate-500">
        <div className="flex justify-between items-center w-full">
          <p className="text-xs">&copy; 2024 | Biology Haters</p>
          <p className="text-xs">
            Developed by{" "}
            <a
              href="https://www.facebook.com/rayat.ass"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "link",
                  className: "text-slate-500 text-xs p-0 underline",
                })
              )}
            >
              @Zul Ikram
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
