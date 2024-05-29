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
  const currentPage = searchParams.page;
  console.log({ currentPage });

  const query = searchParams.query;

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
        searchParams.subjects?.map((subject) => `subject.name:${subject}`) ||
          [],
      ],
    })
  );

  const posts = results.hits;

  return (
    <>
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
    </>
  );
}
