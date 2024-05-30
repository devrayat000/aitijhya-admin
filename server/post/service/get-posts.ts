import { bookAuthor, chapter, post, subject } from "@/db/schema";
import { GetParams, GetResults } from "../../types";
import { countPosts } from "./count-posts";
import { getFilteredPosts } from "./get-filtered-posts";
import { desc } from "drizzle-orm";

export type PostTable = {
  id: string;
  text: string;
  page: number | null;
  keywords: string[] | null;
  imageUrl: string;
  chapter: {
    name: string;
    id: string;
  };
  subject: {
    name: string;
    id: string;
  };
  book: {
    name: string;
    id: string;
  };
  createdAt: Date;
};

export async function getPosts(params?: GetParams): GetResults<PostTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = params?.query?.trim();
  console.log("getPosts -> query", query);

  const [data, count] = await Promise.all([
    getFilteredPosts({
      limit,
      page,
      query,
      fields: {
        id: post.id,
        text: post.text,
        page: post.page,
        keywords: post.keywords,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
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
      },
      orderBy: [desc(post.createdAt)],
    }),
    countPosts(query),
  ]);

  return { data, count };
}
