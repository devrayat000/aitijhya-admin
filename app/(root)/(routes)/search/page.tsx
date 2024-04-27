import Image from "next/image";
import { RedirectType, redirect } from "next/navigation";
import Link from "next/link";

import { postIndex } from "@/lib/algolia";
import { PostHit } from "@/services/post";
import BookmarkButton from "./components/bookmark";
import { Button } from "@/components/ui/button";
import logoSingle from "@/assets/logo_single.png";
import SearchForm from "./components/search-form";
import PostPagination from "./components/pagination";

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
          posts.map((post) => (
            <article
              key={post.objectID}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative isolate aspect-[3/4] rounded-inherit border-border border">
                <Image
                  src={post.imageUrl!}
                  alt={post.book.name}
                  fill
                  className="rounded-inherit object-cover"
                />
                <BookmarkButton postId={post.objectID} />
              </div>
              <div className="grid grid-cols-3 gap-x-2 h-full text-white bg-card-result px-3 py-2">
                <div>
                  <span className="block text-[0.5rem] leading-none">
                    {post.book.edition} - Edition
                  </span>
                  <h6 className="text-xs leading-none mt-px">
                    {post.book.name}
                  </h6>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs h-7 py-0.5 leading-none rounded-full"
                  asChild
                  // onClick={() => useEbook.getState().open(post)}
                >
                  <a
                    href={post.imageUrl!}
                    title="Result image"
                    target="_blank"
                    rel="noreferer"
                  >
                    See full image
                  </a>
                </Button>
                <p className="text-xs rounded-full leading-none">
                  {post.chapter.name}
                </p>
              </div>
            </article>
          ))
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
