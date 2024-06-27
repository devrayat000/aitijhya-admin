import { ad, adsToSubjects, subject } from "@/db/schema";
import db from "@/lib/db";
import { GetParams } from "@/server/types";
import { SQL, and, eq, ilike, inArray } from "drizzle-orm";
import { SelectedFields } from "drizzle-orm/pg-core";
import _ from "lodash";

interface GetFilteredAdsParams<TSelection extends SelectedFields>
  extends GetParams {
  ads?: string[];
  fields: TSelection;
}

export async function getFilteredAds<TSelection extends SelectedFields>(
  params: GetFilteredAdsParams<TSelection>
) {
  let queryBuilder = db.select(params.fields).from(ad);

  // Joins
  if (params.fields.subjects) {
    const { subjects, ...fields } = params.fields;
    queryBuilder = queryBuilder
      .leftJoin(adsToSubjects, eq(ad.id, adsToSubjects.adId))
      // @ts-ignore
      .leftJoin(subject, eq(adsToSubjects.subjectId, subject.id))
      .groupBy(...Object.values(fields));
  }

  // Conditions
  let conditions: (SQL<unknown> | undefined)[] = [];

  if (!!params?.ads?.length) {
    if (params.ads.length > 1) {
      conditions.push(inArray(ad.id, params.ads));
    } else {
      conditions.push(eq(ad.id, params.ads[0]));
    }
  }

  if (params?.query) {
    conditions.push(ilike(ad.title, `%${params?.query}%`));
  }

  if (!!conditions.length) {
    if (conditions.length > 1) {
      // @ts-ignore
      queryBuilder = queryBuilder.where(and(...conditions));
    } else {
      // @ts-ignore
      queryBuilder = queryBuilder.where(conditions[0]);
    }
  }

  // Pagination
  if (params?.orderBy) {
    // @ts-ignore
    queryBuilder = queryBuilder.orderBy(params.orderBy);
  }
  if (params?.page && params.limit) {
    // @ts-ignore
    queryBuilder = queryBuilder.offset((params.page - 1) * params.limit);
  }
  if (params?.limit) {
    // @ts-ignore
    queryBuilder = queryBuilder.limit(params.limit);
  }

  console.log(queryBuilder.toSQL());

  const filteredAds = await queryBuilder.execute();
  return filteredAds;
}
