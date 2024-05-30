import { bookAuthor, subject } from "@/db/schema";
import db from "@/lib/db";
import { eq, ilike, sql } from "drizzle-orm";
import { GetParams, GetResults, TableData } from "../../types";
import { countBooks } from "./count-books";
import { getFilteredBooks } from "./get-filtered-books";

export type BookTable = {
  id: string;
  name: string;
  edition: string;
  marked: boolean;
  subject: {
    name: string;
    id: string;
  };
};

export async function getBooks(params?: GetParams): GetResults<BookTable> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const query = params?.query;

  const [data, count] = await Promise.all([
    getFilteredBooks({
      page,
      limit,
      query,
      fields: {
        id: bookAuthor.id,
        name: bookAuthor.name,
        edition: bookAuthor.edition,
        marked: bookAuthor.marked,
        subject: {
          name: subject.name,
          id: subject.id,
        },
      },
    }),
    countBooks(query),
  ]);
  return { data, count };
}
