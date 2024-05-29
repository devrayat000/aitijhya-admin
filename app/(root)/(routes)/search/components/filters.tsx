import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllSubjects } from "@/server/subject/service";
import { use } from "react";
import { SearchSchema } from "./searchSchema";
import { postIndex } from "@/lib/algolia";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";

// TODO: Implement progressive filtering
export default function Filters({
  searchParams,
}: {
  searchParams: SearchSchema;
}) {
  const subjects = use(postIndex.searchForFacetValues("subject.name", ""));
  const books = use(
    postIndex.searchForFacetValues("book.name", "", {
      facetFilters: [
        searchParams.subjects?.map((subject) => `subject.name:${subject}`) ||
          [],
      ],
    })
  );
  const chapters = use(
    postIndex.searchForFacetValues("chapter.name", "", {
      hitsPerPage: 20,
      query: "",
      facetFilters: [
        searchParams.subjects?.map((subject) => `subject.name:${subject}`) ||
          [],
        searchParams.books?.map((book) => `book.name:${book}`) || [],
      ],
    })
  );

  return (
    <form className="p-4">
      <h3 className="text-2xl font-semibold">Filters</h3>
      <input type="hidden" name="query" value={searchParams.query} />
      {searchParams?.page && (
        <input type="hidden" name="page" value={searchParams?.page} />
      )}

      <Accordion type="single" collapsible className="mt-3">
        <AccordionItem value="subjects">
          <AccordionTrigger>Subjects</AccordionTrigger>
          <AccordionContent asChild>
            <div className="mt-2 flex flex-col gap-x-1 gap-y-1.5 flex-wrap justify-between">
              {subjects.facetHits.map((subject) => {
                return (
                  <div
                    className="flex items-center space-x-2"
                    key={subject.value}
                  >
                    <Checkbox
                      id={subject.value}
                      name="subjects"
                      value={subject.value}
                      defaultChecked={searchParams.subjects?.includes(
                        subject.value
                      )}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject.value}
                    </label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="books">
          <AccordionTrigger>Books</AccordionTrigger>
          <AccordionContent asChild>
            <div className="mt-2 flex flex-col gap-x-1 gap-y-1.5 flex-wrap justify-between">
              {books.facetHits.map((subject) => {
                return (
                  <div
                    className="flex items-center space-x-2"
                    key={subject.value}
                  >
                    <Checkbox
                      id={subject.value}
                      name="subjects"
                      value={subject.value}
                      defaultChecked={searchParams.subjects?.includes(
                        subject.value
                      )}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject.value}
                    </label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="chapters">
          <AccordionTrigger>Chapters</AccordionTrigger>
          <AccordionContent asChild>
            <div className="mt-2 flex flex-col gap-x-1 gap-y-1.5 flex-wrap justify-between">
              {chapters.facetHits.map((subject) => {
                return (
                  <div
                    className="flex items-center space-x-2"
                    key={subject.value}
                  >
                    <Checkbox
                      id={subject.value}
                      name="subjects"
                      value={subject.value}
                      defaultChecked={searchParams.subjects?.includes(
                        subject.value
                      )}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject.value}
                    </label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" className="mt-5 w-full">
        Apply Filters
      </Button>
    </form>
  );
}
