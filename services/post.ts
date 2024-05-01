import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { count, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { GetParams } from "./types";

const postCountStatement = db
  .select({ count: count() })
  .from(post)
  .where(ilike(post.text, sql.placeholder("query")))
  .prepare("get_post_count");

const postsStatement = db
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
    createdAt: post.createdAt,
  })
  .from(post)
  .innerJoin(chapter, eq(chapter.id, post.chapterId))
  .innerJoin(bookAuthor, eq(bookAuthor.id, chapter.bookAuthorId))
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .where(ilike(post.text, sql.placeholder("query")))
  .orderBy(desc(post.createdAt))
  .prepare("get_posts");

const postByIdStatement = db
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
  .where(eq(post.id, sql.placeholder("id")))
  .prepare("get_post_by_id");

export type PostsQuery = Awaited<
  ReturnType<(typeof postsStatement)["execute"]>
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
  const [post] = await postByIdStatement.execute({ id });
  return post;
}

const allPostsIndexStatement = db
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
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .prepare("get_all_posts_for_indexing");

const postIndexStatement = db
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
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .where(eq(post.id, sql.placeholder("id")))
  .prepare("get_post_by_id_for_indexing");

export async function getPostByIdForIndexing(id: string) {
  const [post] = await postIndexStatement.execute({ id });
  return post;
}

const postsIndexStatement = db
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
  .innerJoin(subject, eq(subject.id, bookAuthor.subjectId))
  .where(inArray(post.id, sql.placeholder("ids")))
  .prepare("get_posts_by_ids_for_indexing");

export async function getPostsByIdsForIndexing(ids: string[]) {
  const posts = await postsIndexStatement.execute({ ids });
  return posts;
}

export async function getAllPostsForIndexing() {
  const posts = await allPostsIndexStatement.execute();
  return posts;
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
