import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { desc, eq, ilike, sql } from "drizzle-orm";
import { GetParams, GetResults, TableData } from "../../types";
import { countPosts } from "./count-posts";

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
  .where(ilike(post.text, sql.placeholder("query")))
  .orderBy(desc(post.createdAt))
  .offset(sql.placeholder("offset"))
  .limit(sql.placeholder("limit"))
  .prepare("get_posts");

export type PostTable = TableData<typeof postsStatement>;

export async function getPosts(params?: GetParams): GetResults<PostTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = `%${params?.query || ""}%`;
  console.log("getPosts -> query", query);

  const [data, count] = await Promise.all([
    postsStatement.execute({
      limit,
      offset: (page - 1) * limit,
      query,
    }),
    countPosts(query),
  ]);

  return { data, count };
}
