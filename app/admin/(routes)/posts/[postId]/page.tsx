import { Suspense } from "react";
import dynamic from "next/dynamic";

import { getPostById } from "@/services/post";
import { getSubjects } from "@/services/subject";
import { getBooksBySubject } from "@/actions/book";
import { getChaptersByBooks } from "@/actions/chapter";

const PostForm = dynamic(
  () => import("./components/post-form").then((m) => ({ default: m.PostForm })),
  {
    ssr: false,
  }
);

const PostPage = async ({ params }: { params: { postId: string } }) => {
  let initialData: any = {
    subjects: (await getSubjects()).subjects,
  };

  if (params.postId !== "new") {
    const post = await getPostById(params.postId);
    initialData = {
      ...initialData,
      post,
      books: await getBooksBySubject(null, post.subject!.id),
      chapters: await getChaptersByBooks(null, post.book!.id),
    };
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6" suppressHydrationWarning>
        <Suspense>
          <PostForm initialData={initialData} />
        </Suspense>
      </div>
    </div>
  );
};

export default PostPage;
