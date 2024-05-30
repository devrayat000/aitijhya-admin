import { bookAuthor, chapter, post, subject } from "@/db/schema";
import { getFilteredPosts } from "./get-filtered-posts";

export async function getManyPostsForIndexing(ids: string[]) {
  const posts = await getFilteredPosts({
    posts: ids,
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
