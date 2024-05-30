import { bookAuthor, post, subject, chapter } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { getFilteredPosts } from "./get-filtered-posts";

export async function getAllPostsForIndexing() {
  const posts = await getFilteredPosts({
    fields: {
      objectID: post.id,
      text: post.text,
      keywords: post.keywords,
      imageUrl: post.imageUrl,
      chapter: {
        name: chapter.name,
      },
      book: {
        name: bookAuthor.name,
        edition: bookAuthor.edition,
      },
      subject: {
        name: subject.name,
      },
    },
  });
  return posts;
}
