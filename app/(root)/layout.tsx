import { EbookProvider } from "@/providers/ebook-provider";
import { PopupProvider } from "@/providers/popup-provider";
import { Fragment } from "react";

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
