import { ad } from "@/db/schema";
import { getFilteredAds } from "./get-filtered-ads";

export function getAllAds() {
  return getFilteredAds({
    fields: {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      link: ad.link,
      createdAt: ad.createdAt,
    },
  });
}
