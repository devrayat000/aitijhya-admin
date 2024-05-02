// import { Fragment } from "react";
// import { PopupProvider } from "@/providers/popup-provider";
// import ImageProvider from "@/providers/image-provider";
// import dynamic from "next/dynamic";

import Header from "../components/header";
import { getBookmarkedList } from "@/server/bookmark/service";
import { ServerStoreProvider } from "@/hooks/use-server-data";

// const EbookProvider = dynamic(() => import("@/providers/ebook-provider"), {
//   ssr: false,
//   // loader: () => import("../../loading"),
// });

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookmarks] = await Promise.all([getBookmarkedList()]);

  return (
    <ServerStoreProvider initialData={{ bookmarks, searchHistory: [] }}>
      <Header />
      <div className="relative z-10">{children}</div>
      {/* <PopupProvider /> */}
      {/* <ImageProvider /> */}
    </ServerStoreProvider>
  );
}
