import { bookAuthor, chapter, subject } from "@/db/schema";
import { GetParams, GetResults } from "../../types";
import { countChapters } from "./count-chapters";
import { getFilteredChapters } from "./get-filtered-chapters";

export type ChapterTable = {
  id: string;
  name: string;
  book: {
    name: string;
    id: string;
  };
  subject: {
    name: string;
    id: string;
  };
};

export async function getChapters(
  params?: GetParams
): GetResults<ChapterTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;

  const [data, count] = await Promise.all([
    getFilteredChapters({
      limit,
      page,
      query,
      fields: {
        id: chapter.id,
        name: chapter.name,
        book: {
          name: bookAuthor.name,
          id: bookAuthor.id,
        },
        subject: {
          name: subject.name,
          id: subject.id,
        },
      },
    }),
    countChapters(query),
  ]);

  // @ts-ignore
  return { data, count };
}
