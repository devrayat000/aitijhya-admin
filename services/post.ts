import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { count, eq, ilike, inArray, sql } from "drizzle-orm";
import { GetParams } from "./types";

const postsQuery = db
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

const postCountStatement = db
  .select({ count: count() })
  .from(post)
  .where(ilike(post.text, sql.placeholder("query")))
  .prepare("get_post_count");

const postsStatement = postsQuery
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(post.text, sql.placeholder("query")))
  .prepare("get_posts");

const postByIdStatement = postsQuery
  .where(eq(post.id, sql.placeholder("id")))
  .prepare("get_post_by_id");

export type PostsQuery = Awaited<
  ReturnType<(typeof postsQuery)["execute"]>
>[number];
export async function getPosts(params?: GetParams) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;
  console.log("getPosts -> query", query);

  const [posts, [{ count }]] = await Promise.all([
    postsStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    postCountStatement.execute({ query }),
  ]);

  return { posts, count };
}

export async function getPostById(id: string) {
  const [book] = await postByIdStatement.execute({ id });
  return book;
}

const postIndexQuery = db
  .select({
    objectID: post.id,
    text: post.text,
    keywords: post.keywords,
    imageUrl: post.imageUrl,
    chapter: {
      name: chapter.name,
    },
    subject: {
      name: subject.name,
    },
    book: {
      name: bookAuthor.name,
      edition: bookAuthor.edition,
    },
  })
  .from(post)
  .innerJoin(chapter, eq(chapter.id, post.chapterId))
  .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId));

const allPostsIndexStatement = postIndexQuery.prepare(
  "get_all_posts_for_indexing"
);

const postIndexStatement = postIndexQuery
  .where(eq(post.id, sql.placeholder("id")))
  .prepare("get_post_by_id_for_indexing");

export async function getPostByIdForIndexing(id: string) {
  const [book] = await postIndexStatement.execute({ id });
  return book;
}

export async function getAllPostsForIndexing() {
  const books = await allPostsIndexStatement.execute();
  return books;
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
      coverUrl: bookAuthor.coverUrl,
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
