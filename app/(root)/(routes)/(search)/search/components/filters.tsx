import { use } from "react";
import { SearchSchema } from "./searchSchema";
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
  const subjects = use(postIndex.searchForFacetValues("subject.name", ""));
  const books = searchParams.subject
    ? use(getBooksBySubject([], searchParams.subject))
    : undefined;
  const chapters = searchParams.book
    ? use(getChaptersByBook([], searchParams.book))
    : undefined;

  const initial = {
    subjects: subjects.facetHits,
    books: books,
    chapters,
  };

  return (
    <>
      <FilterSidebar initialData={initial} searchParams={searchParams} />
      <FilterSheet initialData={initial} searchParams={searchParams} />
    </>
  );
}