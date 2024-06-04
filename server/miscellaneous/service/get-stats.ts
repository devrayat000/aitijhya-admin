import db from "@/lib/db";
import { mapKeys, camelCase } from "lodash";
import { unstable_cache as cache } from "next/cache";

import { post, subject, chapter, bookAuthor, users } from "@/db/schema";
import { sql } from "drizzle-orm";

const statsStatement = sql`
SELECT
    (SELECT COUNT(*) FROM ${users}) AS user_count,
    (SELECT COUNT(*) FROM ${subject}) AS subject_count,
    (SELECT COUNT(*) FROM ${bookAuthor}) AS book_author_count,
    (SELECT COUNT(*) FROM ${chapter}) AS chapter_count,
    (SELECT COUNT(*) FROM ${post}) AS post_count;
`;

export type Stats = {
  userCount: number;
  subjectCount: number;
  bookAuthorCount: number;
  chapterCount: number;
  postCount: number;
};

export const getStats = cache(
  async (): Promise<Stats> => {
    const [stats] = await db.execute<Stats>(statsStatement);
    return mapKeys(stats, (_, key) => camelCase(key)) as any;
  },
  ["getStats"],
  { tags: ["getStats"], revalidate: 1800 }
);
