import { use } from "react";
import without from "lodash/without";

import { postIndex } from "@/lib/algolia";
import ResultCard, { ResultCardProps } from "./result-card";
import PostPagination from "./pagination";
import { SearchSchema, searchSchema } from "./searchSchema";

export default function SearchResults({
  searchParams: params,
}: {
  searchParams: SearchSchema;
}) {
  const searchParams = use(searchSchema.parseAsync(params));
  const { page: currentPage, query, subject, chapter, book } = searchParams;

  const facets = without(
    [
      subject ? `subject.name:${subject}` : null,
      book ? `book.name:${book}` : null,
      chapter ? `chapter.name:${chapter}` : null,
    ],
    null
  );

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
      facetFilters: facets as unknown as string[],
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
