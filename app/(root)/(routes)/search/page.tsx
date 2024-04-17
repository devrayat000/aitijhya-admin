import { getBookmarkedList } from "@/services/bookmark";
import SearchClient from "./components/search-client";
import { ServerStoreProvider } from "@/hooks/use-server-data";
import { getCurrentUserSearchHistory } from "@/services/history";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  console.log("server log", searchParams);

  const [bookmarks, searchHistory] = await Promise.all([
    getBookmarkedList(),
    getCurrentUserSearchHistory(),
  ]);

  return (
    <ServerStoreProvider initialData={{ bookmarks, searchHistory }}>
      <SearchClient />
    </ServerStoreProvider>
  );
}
