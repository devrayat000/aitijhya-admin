"use client";

import { toggleBookmark } from "@/actions/bookmark";
import { useServerStore } from "@/hooks/use-server-data";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useCallback, useOptimistic } from "react";
import { useFormState } from "react-dom";

export interface BookmarkButtonProps {
  postId: string;
}

export default function BookmarkButton({ postId }: BookmarkButtonProps) {
  const bookmarked = useServerStore(
    useCallback(
      (state) => state.bookmarks.some((bm) => bm.postId === postId),
      [postId]
    )
  );

  console.log({ [postId]: bookmarked });

  const [isBookmarked, toggle] = useFormState(toggleBookmark, bookmarked);
  const [isOptimisticBookmarked, optimisticToggle] = useOptimistic<
    boolean,
    boolean
  >(isBookmarked, (prev, current) => !prev);

  function initiateToggle() {
    optimisticToggle(true);
    toggle(postId);
  }

  return (
    <button className="absolute top-0 right-2 z-50" onClick={initiateToggle}>
      {!isOptimisticBookmarked ? <Bookmark /> : <BookmarkCheck />}
    </button>
  );
}
