import { Fragment } from "react";
import Header from "./components/header";
import { EbookProvider } from "@/providers/ebook-provider";
import { PopupProvider } from "@/providers/popup-provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Header />
      {children}
      <PopupProvider />
      <EbookProvider />
    </Fragment>
  );
}
