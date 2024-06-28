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
    <div className="relative h-screen overflow-hidden">
      {children}
      <GoogleAnalytics gaId={process.env.GA_TRACKING_ID!} />
    </div>
  );
}
