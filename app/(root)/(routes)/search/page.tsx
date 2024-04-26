import Image from "next/image";
import { redirect } from "next/navigation";
import { Camera, Search } from "lucide-react";

import { postIndex } from "@/lib/algolia";
import { PostHit } from "@/services/post";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import BookmarkButton from "./components/bookmark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import logoSingle from "@/assets/logo_single.png";
import SearchForm from "./components/search-form";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query: string; page?: string };
}) {
  if (!searchParams?.query) {
    redirect("/");
  }

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  const query = searchParams.query;

  const results = await postIndex.search<PostHit>(query, {
    optionalWords: query,
    hitsPerPage: 12,
    page: currentPage - 1,
  });

  const neighborPages = [currentPage - 1, currentPage, currentPage + 1];
  while (neighborPages[0] < 2) {
    neighborPages.shift();
  }
  while (neighborPages[neighborPages.length - 1] > results.nbPages - 1) {
    neighborPages.pop();
  }

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
      <Pagination className="pb-4">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={{
                  query: {
                    ...searchParams,
                    page: currentPage - 1,
                  },
                }}
              />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              href={{
                query: {
                  ...searchParams,
                  page: 1,
                },
              }}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
          {currentPage >= 4 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {neighborPages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={{
                  query: {
                    ...searchParams,
                    page,
                  },
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage <= results.nbPages - 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              href={{
                query: {
                  ...searchParams,
                  page: results.nbPages,
                },
              }}
              isActive={currentPage === results.nbPages}
            >
              {results.nbPages}
            </PaginationLink>
          </PaginationItem>
          {currentPage < results.nbPages && (
            <PaginationItem>
              <PaginationNext
                href={{
                  query: {
                    ...searchParams,
                    page: currentPage + 1,
                  },
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
