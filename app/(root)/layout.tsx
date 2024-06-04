// "use client";

import { buttonVariants } from "@/components/ui/button";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-h-svh">
      {children}
      <GoogleAnalytics gaId={process.env.GA_TRACKING_ID!} />
      <footer className="px-8 md:px-16 grid place-items-center h-10 md:h-16">
        <div className="flex justify-between items-center w-full">
          <p>&copy; 2024 Biology Haters | All Rights Reserved</p>
          <p>
            Developed by{" "}
            <a
              href="https://www.facebook.com/rayat.ass"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "link" })}
            >
              @Zul Ikram
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
