import { bookAuthor, chapter, subject } from "@/db/schema";
import { getFilteredChapters } from "./get-filtered-chapters";
import { ChapterTable } from "./get-chapters";

export async function getChapterById(id: string): Promise<ChapterTable> {
  const [chapterById] = await getFilteredChapters({
    chapters: [id],
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
  });

  return chapterById as unknown as ChapterTable;
}
