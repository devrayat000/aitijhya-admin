import { getBookmarkedList } from "@/services/bookmark";
import SearchClient from "./components/search-client";
import { ServerStoreProvider } from "@/hooks/use-server-data";
import { getCurrentUserSearchHistory } from "@/services/history";
import { postIndex } from "@/lib/algolia";
import { PostHit, PostHitResults, getHitPostsByIds } from "@/services/post";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { redirect } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ResultCard from "./components/result-card";
import BookmarkButton from "./components/bookmark";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Camera, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import logoSingle from "@/assets/logo_single.png";

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
      <form role="search" className="mt-2" method="get" action="/search">
        <div className="flex gap-2 mx-8">
          <div className="flex justify-center">
            <Image src={logoSingle} alt="logo" width={120} />
          </div>
          <div className="px-4 flex flex-1 h-12 w-full rounded-full border border-input bg-input py-2 text-sm items-center justify-between gap-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Questions or keywords..."
              className="flex-1 bg-transparent text-sm p-0 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              type="search"
              name="query"
              defaultValue={query}
            />
            <Separator orientation="vertical" className="bg-slate-400 w-0.5" />
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 rounded-full"
              type="button"
            >
              <Camera className="h-5 w-5 text-muted-foreground" />
              {/* <input {...getInputProps()} /> */}
            </Button>
          </div>

          <Button
            type="submit"
            size="icon"
            className="w-12 h-12 rounded-full bg-card-result hover:bg-card-result/90"
            variant="default"
          >
            <Search className="h-8 w-8 text-white" />
          </Button>
        </div>
      </form>
      <section className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
        {posts ? (
          posts.map((post) => (
            <article
              key={post.objectID}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative aspect-video rounded-inherit border-border border">
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
