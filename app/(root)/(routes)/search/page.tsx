import { getBookmarkedList } from "@/services/bookmark";
import SearchClient from "./components/search-client";
import { ServerStoreProvider } from "@/hooks/use-server-data";
import { getCurrentUserSearchHistory } from "@/services/history";
import { postIndex } from "@/lib/algolia";
import { PostHitResults, getHitPostsByIds } from "@/services/post";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q: string };
}) {
  console.log("server log", searchParams);

  const [bookmarks, searchHistory] = await Promise.all([
    getBookmarkedList(),
    getCurrentUserSearchHistory(),
  ]);

  let posts: PostHitResults | undefined = undefined;

  // if (searchParams?.q) {
  //   const result = await postIndex.search<PostHitResults[number]>(
  //     searchParams.q,
  //     {
  //       optionalWords: searchParams.q,
  //       hitsPerPage: 12,
  //     }
  //   );
  //   const ids = result.hits.map((hit) => hit.objectID);
  //   posts = await getHitPostsByIds(ids);
  // }

  return (
    <ServerStoreProvider
      initialData={{ bookmarks, searchHistory, searchResults: posts }}
    >
      <SearchClient />
    </ServerStoreProvider>
  );
}
