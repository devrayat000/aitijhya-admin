// "use client";

import Image from "next/image";

import { PostHit } from "@/server/post/service";
import BookmarkButton from "./bookmark";
import { Button } from "@/components/ui/button";

export type ResultCardProps = PostHit;

export default function ResultCard(post: ResultCardProps) {
  return (
    <article className="rounded-2xl overflow-hidden shadow-lg">
      <div className="relative isolate aspect-[3/4] rounded-inherit border-border border">
        <Image
          src={post.imageUrl!}
          alt={post.book.name}
          fill
          className="rounded-inherit object-cover"
        />
        <BookmarkButton postId={post.objectID} />
      </div>
      <div className="grid grid-cols-3 gap-x-2 h-full text-white bg-card-result px-3 py-2">
        <div>
          <span className="block text-[0.5rem] leading-none">
            {post.book.edition} - Edition
          </span>
          <h6 className="text-xs leading-none mt-px">{post.book.name}</h6>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="text-xs h-7 py-0.5 leading-none rounded-full"
          asChild
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
        <p className="text-xs rounded-full leading-none">{post.chapter.name}</p>
      </div>
    </article>
  );
}
