import { bookAuthor, chapter, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq, ilike, sql } from "drizzle-orm";
import { GetParams, GetResults, TableData } from "../../types";
import { countChapters } from "./count-chapters";

const chaptersStatement = db
  .select({
    id: chapter.id,
    name: chapter.name,
    subject: {
      name: subject.name,
      id: subject.id,
    },
    book: {
      name: bookAuthor.name,
      id: bookAuthor.id,
    },
  })
  .from(chapter)
  .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(chapter.name, sql.placeholder("query")))
  .prepare("get_chapters");

export type ChapterTable = TableData<typeof chaptersStatement>;

export async function getChapters(
  params?: GetParams
): GetResults<ChapterTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;

  const [data, count] = await Promise.all([
    chaptersStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    countChapters(query),
  ]);

  return { data, count };
}
