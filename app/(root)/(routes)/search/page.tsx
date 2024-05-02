import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";

import { postIndex } from "@/lib/algolia";
import { PostHit } from "@/server/post/service";
import logoSingle from "@/assets/logo_single.png";
import SearchForm from "./components/search-form";
import PostPagination from "./components/pagination";
import ResultCard from "./components/result-card";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query: string; page?: string };
}) {
  if (!searchParams?.query) {
    redirect("/", RedirectType.replace);
  }

  const currentPage = parseInt(searchParams.page || "1");

  const query = searchParams.query;

  const results = await postIndex.search<PostHit>(query, {
    optionalWords: query,
    hitsPerPage: 12,
    page: currentPage - 1,
    cacheable: true,
  });

  const posts = results.hits;

  return (
    <div className="px-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={120} />
        </Link>
        <div className="flex-1">
          <SearchForm />
        </div>
      </div>
      <section className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
        {posts ? (
          posts.map((post) => <ResultCard key={post.objectID} {...post} />)
        ) : (
          <div className="flex justify-center">
            <p>Nothing found... 😓</p>
          </div>
        )}
      </section>
      <PostPagination
        currentPage={currentPage}
        searchParams={searchParams}
        totalPages={results.nbPages}
      />
    </div>
  );
}
