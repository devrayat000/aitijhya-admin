import { use } from "react";

import { postIndex } from "@/lib/algolia";
import { PostHit } from "@/server/post/service";
import ResultCard, { ResultCardProps } from "./result-card";
import PostPagination from "./pagination";

import { promisify } from "node:util";
import { SearchSchema, searchSchema } from "./searchSchema";

const wait = promisify(setTimeout);

export default function SearchResults({
  searchParams: params,
}: {
  searchParams: SearchSchema;
}) {
  const searchParams = use(searchSchema.parseAsync(params));
  const { page: currentPage, query, subject, chapter, book } = searchParams;
  console.log({ currentPage });

  const results = use(
    postIndex.search<ResultCardProps>(query, {
      optionalWords: query,
      hitsPerPage: 12,
      page: currentPage - 1,
      cacheable: true,
      attributesToRetrieve: [
        "objectID",
        "imageUrl",
        "book",
        "chapter",
        "keywords",
      ],
      facetFilters: [
        subject ? `subject.name:${subject}` : [],
        book ? `book.name:${book}` : [],
        chapter ? `chapter.name:${chapter}` : [],
      ],
    })
  );

  const posts = results.hits;

  return (
    <div className="@container/grid w-full">
      <section className="flex flex-col @sm/grid:grid @lg/grid:grid-cols-2 @xl/grid:grid-cols-3 gap-4 py-8">
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
