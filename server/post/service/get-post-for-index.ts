import { bookAuthor, post, subject, chapter } from "@/db/schema";
import { getFilteredPosts } from "./get-filtered-posts";

export async function getPostByIdForIndexing(id: string) {
  const [postById] = await getFilteredPosts({
    posts: [id],
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
  return postById;
}

export type PostHit = Awaited<ReturnType<typeof getPostByIdForIndexing>>;
