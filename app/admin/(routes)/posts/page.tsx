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
  console.log(
    await getPostsByIdsForIndexing([
      "36271c29-5240-4938-a092-b65b207741c3",
      "1d260c09-bde4-40c1-bd1a-cadf5cfbe4c9",
      "f55c7de8-21c7-453a-92c6-83ddeeedf819",
      "79c9a8b6-8ebd-4ed2-a746-19ea01873fdc",
      "e4fa70e6-e1c0-45f3-8a47-36737a2def89",
      "8fc6ddbc-60d1-47a8-9ee4-640ac4a53617",
      "9da3c434-2bdb-4e7d-bf34-b8f719d4225f",
      "f42804c9-c80d-40bf-9e41-e94b01ad7704",
    ])
  );

  const { page, limit, query } = searchParamsSchema.parse(searchParams);
  const { posts, count } = await getPosts({ page, limit, query });

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
