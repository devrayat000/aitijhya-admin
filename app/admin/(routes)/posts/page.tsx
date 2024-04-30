// import { format } from "date-fns";

import { PostsClient } from "./components/client";
import { getPosts } from "@/services/post";

const PostsPage = async () => {
  const posts = await getPosts();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PostsClient data={posts} />
      </div>
    </div>
  );
};

export default PostsPage;

export const dynamic = true;
