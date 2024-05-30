import { and, eq, ilike, inArray, type SQL } from "drizzle-orm";
import db from "@/lib/db";
import { GetParams } from "@/server/types";
import { SelectedFields } from "drizzle-orm/pg-core";
import { bookAuthor, subject } from "@/db/schema";
import isObject from "lodash/isObject";

interface GetFilteredBooksParams<TSelection extends SelectedFields>
  extends GetParams {
  books?: string[];
  marked?: boolean;
  editions?: string[];
  subjects?: string[];
  fields: TSelection;
}

export async function getFilteredBooks<TSelection extends SelectedFields>(
  params: GetFilteredBooksParams<TSelection>
) {
  let queryBuilder = db.select(params.fields).from(bookAuthor);

  // Joins
  if (isObject(params.fields.subject)) {
    // @ts-ignore
    queryBuilder = queryBuilder.innerJoin(
      subject,
      eq(bookAuthor.subjectId, subject.id)
    );
  }

  // Conditions
  let conditions: (SQL<unknown> | undefined)[] = [];

  if (!!params?.books?.length) {
    if (params.books.length > 1) {
      conditions.push(inArray(bookAuthor.id, params.books));
    } else {
      conditions.push(eq(bookAuthor.id, params.books[0]));
    }
  }

  if (!!params?.subjects?.length) {
    if (params.subjects.length > 1) {
      conditions.push(inArray(bookAuthor.subjectId, params.subjects));
    } else {
      conditions.push(eq(bookAuthor.subjectId, params.subjects[0]));
    }
  }

  if (!!params?.editions?.length) {
    if (params.editions.length > 1) {
      conditions.push(inArray(bookAuthor.edition, params.editions));
    } else {
      conditions.push(eq(bookAuthor.edition, params.editions[0]));
    }
  }

  if (params?.marked !== undefined) {
    conditions.push(eq(bookAuthor.marked, params.marked));
  }

  if (params?.query) {
    conditions.push(ilike(bookAuthor.name, `%${params?.query}%`));
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

  return queryBuilder.execute();
}
