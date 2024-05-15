// "use client";

import { Fragment } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      {children}
      <GoogleAnalytics gaId={process.env.GA_TRACKING_ID!} />
    </Fragment>
  );
}
