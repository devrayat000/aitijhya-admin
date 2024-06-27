import { ad, subject } from "@/db/schema";
import { sql } from "drizzle-orm";
import { GetParams, GetResults } from "../../types";
import { countAds } from "./count-ads";
import { getFilteredAds } from "./get-filtered-ads";

export type AdTable = {
  id: string;
  createdAt: Date;
  title: string;
  imageUrl: string;
  classes: string[] | null;
};

export async function getAds(params?: GetParams): GetResults<AdTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = params?.query;

  const [data, count] = await Promise.all([
    getFilteredAds({
      limit,
      page,
      query,
      fields: {
        id: ad.id,
        title: ad.title,
        imageUrl: ad.imageUrl,
        classes: ad.classes,
        subjects:
          sql`COALESCE(JSON_AGG(ROW_TO_JSON(${subject}.*)),'[]'::JSON)`.as(
            "subjects"
          ),
        createdAt: ad.createdAt,
      },
    }),
    countAds(query),
  ]);

  return { data, count };
}
