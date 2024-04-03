import { postIndex } from "@/lib/algolia";
import { getPostByIdForIndexing } from "@/services/post";

export async function saveIndex(id: string) {
  const post = await getPostByIdForIndexing(id);

  await postIndex.saveObject(post);
}

export async function deleteIndex(id: string) {
  await postIndex.deleteObject(id);
}
