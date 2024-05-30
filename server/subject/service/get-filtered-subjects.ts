import { subject } from "@/db/schema";
import db from "@/lib/db";
import { GetParams } from "@/server/types";
import { SQL, and, eq, ilike, inArray } from "drizzle-orm";
import { SelectedFields } from "drizzle-orm/pg-core";

interface GetFilteredSubjectsParams<TSelection extends SelectedFields>
  extends GetParams {
  subjects?: string[];
  fields: TSelection;
}

export async function getFilteredSubjects<TSelection extends SelectedFields>(
  params: GetFilteredSubjectsParams<TSelection>
) {
  let queryBuilder = db.select(params.fields).from(subject);

  // Joins

  // Conditions
  let conditions: (SQL<unknown> | undefined)[] = [];

  if (!!params?.subjects?.length) {
    if (params.subjects.length > 1) {
      conditions.push(inArray(subject.id, params.subjects));
    } else {
      conditions.push(eq(subject.id, params.subjects[0]));
    }
  }

  if (params?.query) {
    conditions.push(ilike(subject.name, `%${params?.query}%`));
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

  const filteredSubjects = await queryBuilder.execute();
  return filteredSubjects;
}
