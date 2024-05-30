import Header from "../components/header";
import { getBookmarkedList } from "@/server/bookmark/service";
import { ServerStoreProvider } from "@/hooks/use-server-data";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookmarks] = await Promise.all([getBookmarkedList()]);

  return (
    <ServerStoreProvider initialData={{ bookmarks, searchHistory: [] }}>
      {children}
    </ServerStoreProvider>
  );
}
