import Image from "next/image";
import { use } from "react";
import Link from "next/link";

import { getBookmarkedPosts } from "@/server/bookmark/service";
import logoMulti from "@/assets/logo_single.png";
import ResultCard from "../../(search)/search/components/result-card";
import { ServerStoreProvider } from "@/hooks/use-server-data";
import { requireAuth } from "@/lib/auth";

export default function BookmarksPage() {
  const session = use(requireAuth());
  const posts = use(getBookmarkedPosts(session.user.id));

  return (
    <div className="p-4 min-h-[calc(100svh-9rem)]">
      <div className="@container/grid bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/">
          <div className="flex justify-center">
            <Image src={logoMulti} alt="logo" width={200} />
          </div>
        </Link>
        <ServerStoreProvider
          initialData={{
            bookmarks: posts.map((p) => ({ postId: p.objectID })),
            searchHistory: [],
          }}
        >
          <section className="grid @md/grid:grid-cols-2 @lg/grid:grid-cols-3 @xl/grid:grid-cols-4 gap-4 py-8">
            {posts?.map((hit) => (
              <ResultCard key={hit.objectID} {...hit} />
            ))}
          </section>
        </ServerStoreProvider>
      </div>
    </div>
  );
}
