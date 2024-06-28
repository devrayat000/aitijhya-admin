import { use } from "react";
import { SearchSchema, searchSchema } from "./searchSchema";
import { postIndex } from "@/lib/algolia";
import { getBooksBySubject, getChaptersByBook } from "./filters/actions";
import FilterSheet from "./filters/sheet";
import FilterSidebar from "./filters/sidebar";

// TODO: Implement progressive filtering
export default function Filters({
  searchParams,
}: {
  searchParams: SearchSchema;
}) {
  const params = use(searchSchema.parseAsync(searchParams));

  const subjects = use(
    postIndex.searchForFacetValues("subject.name", "", {
      maxFacetHits: 100,
      query: params.query,
    })
  );

  const books = params.subjects?.length
    ? use(
        getBooksBySubject([], {
          subjects: params.subjects || [],
          query: params.query,
        })
      )
    : undefined;
  console.log("Filter Component", params.books);

  const chapters = params.books?.length
    ? use(
        getChaptersByBook([], {
          subjects: params.subjects || [],
          books: params.books || [],
          query: params.query,
        })
      )
    : undefined;

  const initial = {
    subjects: subjects.facetHits,
    books: books,
    chapters: chapters,
  };

  return (
    <>
      <FilterSidebar initialData={initial} searchParams={searchParams} />
      <FilterSheet initialData={initial} searchParams={searchParams} />
    </>
  );
}
