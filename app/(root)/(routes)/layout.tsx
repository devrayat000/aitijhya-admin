import { Fragment } from "react";
import { PopupProvider } from "@/providers/popup-provider";
import ImageProvider from "@/providers/image-provider";
import dynamic from "next/dynamic";

import Header from "../components/header";

// const EbookProvider = dynamic(() => import("@/providers/ebook-provider"), {
//   ssr: false,
//   // loader: () => import("../../loading"),
// });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Header />
      <div className="relative z-10">{children}</div>
      <PopupProvider />
      {/* <ImageProvider /> */}
    </Fragment>
  );
}
