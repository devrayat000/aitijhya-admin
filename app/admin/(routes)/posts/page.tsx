// import { format } from "date-fns";

import { searchParamsSchema } from "@/lib/schemas";
import { PostsClient } from "./components/client";
import { getPosts, getPostsByIdsForIndexing } from "@/services/post";
import { ServerTableStoreProvider } from "@/hooks/use-server-table-data";

const PostsPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { page, limit, query } = searchParamsSchema.parse(searchParams);
  const { posts, count } = await getPosts({ page, limit, query });

  // console.log(
  //   "post info",
  //   posts.map((post) => ({ id: post.id, createdAt: post.createdAt }))
  // );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServerTableStoreProvider initialData={{ data: posts, count }}>
          <PostsClient />
        </ServerTableStoreProvider>
      </div>
    </div>
  );
};

export default PostsPage;

export const dynamic = true;
