"use server";

import { postIndex } from "@/lib/algolia";

export async function getBooksBySubject(
  _: { value: string }[],
  subject: string
) {
  const books = await postIndex.searchForFacetValues("book.name", "", {
    maxFacetHits: 100,
    facetFilters: [subject ? `subject.name:${subject}` : []],
  });
  return books.facetHits;
}

export async function getChaptersByBook(_: { value: string }[], book: string) {
  const books = await postIndex.searchForFacetValues("chapter.name", "", {
    maxFacetHits: 100,
    facetFilters: [book ? `book.name:${book}` : []],
  });
  return books.facetHits;
}
