import { ad } from "@/db/schema";
import db from "@/lib/db";
import { sql, eq } from "drizzle-orm";
import { getFilteredAds } from "./get-filtered-ads";

const adsByIdStatement = db
  .select()
  .from(ad)
  .where(eq(ad.id, sql.placeholder("id")))
  .prepare("get_ad_by_id");

export async function getAdById(id: string) {
  const [adById] = await getFilteredAds({
    ads: [id],
    fields: {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      link: ad.link,
      createdAt: ad.createdAt,
    },
  });
  return adById;
}
