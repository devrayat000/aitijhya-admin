import { ad } from "@/db/schema";
import { getFilteredAds } from "./get-filtered-ads";
import { sql } from "drizzle-orm";

export async function getRandomAds(count = 2) {
  return getFilteredAds({
    fields: {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      link: ad.link,
      createdAt: ad.createdAt,
    },
    limit: count,
    orderBy: [sql`RANDOM()`],
  });
}
