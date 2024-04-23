"use client";

import NextImage from "next/image";

import { PostHitResults } from "@/services/post";
import ResultImage from "./result-image";
import BookmarkButton from "./bookmark";
import { Button } from "@/components/ui/button";
import { useEbook } from "@/hooks/use-ebook";

export type ResultCardProps = PostHitResults[number] & {
  isStatic?: boolean;
};

export default function ResultCard({ isStatic, ...post }: ResultCardProps) {
  const Image = isStatic ? NextImage : ResultImage;

  return (
    <article key={post.id} className="rounded-2xl overflow-hidden shadow-lg">
      <div
        className="relative aspect-video rounded-inherit border-border border"
        // onClick={() => usePopup.getState().open(post)}
      >
        {
          <Image
            src={post.imageUrl!}
            alt={post.book}
            fill
            next
            className="rounded-inherit object-cover"
          />
        }
        <BookmarkButton postId={post.id} />
      </div>
      <div className="flex items-center justify-between text-white bg-card-result px-3 py-2">
        <div>
          <span className="text-[0.5rem] leading-none">Page {post.page}</span>
          <h6 className="text-xs leading-none mt-px">{post.book}</h6>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="text-xs h-7 py-0.5 leading-none rounded-full"
          asChild
          // onClick={() => useEbook.getState().open(post)}
        >
          <a
            href={post.imageUrl!}
            title="Result image"
            target="_blank"
            rel="noreferer"
          >
            See full image
          </a>
        </Button>
        <p className="text-xs px-2 py-1 rounded-full leading-none">
          {post.chapter}
        </p>
      </div>
    </article>
  );
}
