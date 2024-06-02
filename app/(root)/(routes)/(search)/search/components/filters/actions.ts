"use server";

import without from "lodash/without";

import { postIndex } from "@/lib/algolia";

export async function getBooksBySubject(
  _: { value: string }[],
  { subject }: { subject: string }
) {
  const facets = without([subject ? `subject.name:${subject}` : null], null);

  const books = await postIndex.searchForFacetValues("book.name", "", {
    maxFacetHits: 100,
    // @ts-ignore
    facetFilters: facets,
  });
  return books.facetHits;
}

export async function getChaptersByBook(
  _: { value: string }[],
  { book, subject }: { book: string; subject?: string }
) {
  const facets = without(
    [
      book ? `book.name:${book}` : null,
      subject ? `subject.name:${subject}` : null,
    ],
    null
  );

  const books = await postIndex.searchForFacetValues("chapter.name", "", {
    maxFacetHits: 100,
    // @ts-ignore
    facetFilters: facets,
  });
  return books.facetHits;
}
