import { bookAuthor, chapter, subject } from "@/db/schema";
import db from "@/lib/db";
import { count, eq, ilike, sql } from "drizzle-orm";
import { GetParams } from "./types";

// make a select prepared statement
const chaptersQuery = db
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
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId));

const chaptersStatement = chaptersQuery
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(chapter.name, sql.placeholder("query")))
  .prepare("get_chapters");

const chapterCountStatement = db
  .select({ count: count() })
  .from(chapter)
  .where(ilike(chapter.name, sql.placeholder("query")))
  .prepare("get_chapter_count");

const chapterByIdStatement = chaptersQuery
  .where(eq(chapter.id, sql.placeholder("id")))
  .prepare("get_chapter_by_id");

export async function getChapters(params?: GetParams) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;

  const [chapters, [{ count }]] = await Promise.all([
    chaptersStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    chapterCountStatement.execute({ query }),
  ]);

  return { chapters, count };
}

export async function getChapterById(id: string) {
  const [newChapter] = await chapterByIdStatement.execute({ id });
  return newChapter;
}
