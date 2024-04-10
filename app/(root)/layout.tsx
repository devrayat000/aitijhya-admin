// "use client";

import { Fragment } from "react";

import { PopupProvider } from "@/providers/popup-provider";
import dynamic from "next/dynamic";

const EbookProvider = dynamic(() => import("@/providers/ebook-provider"), {
  ssr: false,
  loader: () => import("../loading"),
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      {children}
      <PopupProvider />
      <EbookProvider />
    </Fragment>
  );
}
