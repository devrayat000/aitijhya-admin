import Image from "next/image";
import { use } from "react";
import Link from "next/link";

import { getBookmarkedPosts } from "@/services/bookmark";
import logoMulti from "@/assets/logo_multi.png";
import ResultCard from "../search/components/result-card";
import { ServerStoreProvider } from "@/hooks/use-server-data";

export default function BookmarksPage() {
  const posts = use(getBookmarkedPosts());

  return (
    <div className="p-4">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/">
          <div className="flex justify-center">
            <Image src={logoMulti} alt="logo" width={120} />
          </div>
        </Link>
        <ServerStoreProvider
          initialData={{
            bookmarks: posts.map((p) => ({ postId: p.id })),
            searchHistory: [],
          }}
        >
          <section className="flex flex-col md:flex-row gap-4">
            {posts?.map((hit) => (
              <ResultCard isStatic key={hit.id} {...hit} />
            ))}
          </section>
        </ServerStoreProvider>
      </div>
    </div>
  );
}
