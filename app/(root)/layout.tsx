"use client";

import { Fragment, Suspense } from "react";

import { PopupProvider } from "@/providers/popup-provider";
import dynamic from "next/dynamic";
import Loading from "../loading";

const EbookProvider = dynamic(() => import("@/providers/ebook-provider"), {
  ssr: false,
  // loader: () => import("../loading"),
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
      <Suspense>
        <EbookProvider />
      </Suspense>
    </Fragment>
  );
}
