import { bookAuthor, post, subject, chapter } from "@/db/schema";
import { getFilteredPosts } from "./get-filtered-posts";

export async function getPostById(id: string) {
  const [postById] = await getFilteredPosts({
    posts: [id],
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
  });
  return postById;
}

export type PostById = ReturnType<typeof getPostById>;
