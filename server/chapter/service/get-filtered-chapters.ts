import { and, eq, ilike, inArray, type SQL } from "drizzle-orm";
import db from "@/lib/db";
import { GetParams } from "@/server/types";
import { SelectedFields } from "drizzle-orm/pg-core";
import { chapter, bookAuthor, subject } from "@/db/schema";
import isObject from "lodash/isObject";

interface GetFilteredChaptersParams<TSelection extends SelectedFields>
  extends GetParams {
  chapters?: string[];
  books?: string[];
  subjects?: string[];
  fields: TSelection;
}

export async function getFilteredChapters<TSelection extends SelectedFields>(
  params: GetFilteredChaptersParams<TSelection>
) {
  let queryBuilder = db.select(params.fields).from(chapter);

  // Joins
  if (
    isObject(params.fields.book) ||
    isObject(params.fields.subject) ||
    !!params?.subjects?.length
  ) {
    // @ts-ignore
    queryBuilder = queryBuilder.innerJoin(
      bookAuthor,
      eq(chapter.bookAuthorId, bookAuthor.id)
    );
  }
  if (isObject(params.fields.subject)) {
    // @ts-ignore
    queryBuilder = queryBuilder.innerJoin(
      subject,
      eq(bookAuthor.subjectId, subject.id)
    );
  }

  // Conditions
  let conditions: (SQL<unknown> | undefined)[] = [];

  if (!!params?.chapters?.length) {
    if (params.chapters.length > 1) {
      conditions.push(inArray(chapter.id, params.chapters));
    } else {
      conditions.push(eq(chapter.id, params.chapters[0]));
    }
  }
  if (!!params?.books?.length) {
    if (params.books.length > 1) {
      conditions.push(inArray(chapter.bookAuthorId, params.books));
    } else {
      conditions.push(eq(chapter.bookAuthorId, params.books[0]));
    }
  }
  if (!!params?.subjects?.length) {
    if (params.subjects.length > 1) {
      conditions.push(inArray(bookAuthor.subjectId, params.subjects));
    } else {
      conditions.push(eq(bookAuthor.subjectId, params.subjects[0]));
    }
  }

  if (params?.query) {
    conditions.push(ilike(chapter.name, `%${params?.query}%`));
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
