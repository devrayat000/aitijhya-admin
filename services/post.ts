import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function getPosts() {
  const books = await db
    .select({
      id: post.id,
      text: post.text,
      page: post.page,
      keywords: post.keywords,
      imageUrl: post.imageUrl,
      chapter: {
        name: chapter.name,
        id: chapter.id,
      },
      subject: {
        name: subject.name,
        id: subject.id,
      },
      book: {
        name: bookAuthor.name,
        id: bookAuthor.id,
      },
    })
    .from(post)
    .innerJoin(chapter, eq(chapter.id, post.chapterId))
    .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId));
  return books;
}

export async function getPostById(id: string) {
  const [book] = await db
    .select({
      id: post.id,
      text: post.text,
      page: post.page,
      keywords: post.keywords,
      imageUrl: post.imageUrl,
      chapter: {
        name: chapter.name,
        id: chapter.id,
      },
      subject: {
        name: subject.name,
        id: subject.id,
      },
      book: {
        name: bookAuthor.name,
        id: bookAuthor.id,
      },
    })
    .from(post)
    .innerJoin(chapter, eq(chapter.id, post.chapterId))
    .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
    .where(eq(post.id, id));
  return book;
}

export async function getPostByIdForIndexing(id: string) {
  const [book] = await db
    .select({
      objectID: post.id,
      text: post.text,
      keywords: post.keywords,
      chapter: {
        name: chapter.name,
      },
      subject: {
        name: subject.name,
      },
      book: {
        name: bookAuthor.name,
      },
    })
    .from(post)
    .innerJoin(chapter, eq(chapter.id, post.chapterId))
    .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
    .where(eq(post.id, id));
  return book;
}

export async function getHitPostsByIds(ids: string[]) {
  const books = await db
    .select({
      id: post.id,
      page: post.page,
      imageUrl: post.imageUrl,
      chapter: chapter.name,
      subject: subject.name,
      book: bookAuthor.name,
      bookUrl: bookAuthor.embedUrl,
    })
    .from(post)
    .innerJoin(chapter, eq(chapter.id, post.chapterId))
    .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
    .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
    .where(inArray(post.id, ids));

  return books;
}

export type PostHit = Awaited<ReturnType<typeof getPostByIdForIndexing>>;
export type PostHitResults = Awaited<ReturnType<typeof getHitPostsByIds>>;
