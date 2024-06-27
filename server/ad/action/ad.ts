"use server";

import { ad } from "@/db/schema";
import db from "@/lib/db";
import { InferInsertModel, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAd(params: InferInsertModel<typeof ad>) {
  const [data] = await db.insert(ad).values(params).returning({ id: ad.id });
  revalidatePath("/admin/ads");
  // redirect("/admin/ads");
  return data;
}

export async function updateAd(
  id: string,
  params: Partial<Omit<InferInsertModel<typeof ad>, "id">>
) {
  await db.update(ad).set(params).where(eq(ad.id, id));
  revalidatePath("/admin/ads");
  // redirect("/admin/ads");
  // return data;
}

export async function deleteAd(id: string) {
  await db.delete(ad).where(eq(ad.id, id));
  revalidatePath("/admin/ads");
  // redirect("/admin/ads");
}

export async function deleteManyAds(_: void, ids: string[]) {
  await db.delete(ad).where(inArray(ad.id, ids));
  revalidatePath("/admin/ads");
  // redirect(`/admin/ads`);
}
