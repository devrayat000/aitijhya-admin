import { Fragment } from "react";
import Image from "next/image";

import Header from "../components/header";
import bgBlack from "@/assets/bg_black.jpeg";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <Header />
      <div className="relative z-10">{children}</div>
    </Fragment>
  );
}
