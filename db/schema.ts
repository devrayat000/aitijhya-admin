import { text, integer, pgTable, uuid, unique } from "drizzle-orm/pg-core";

export const subject = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const bookAuthor = pgTable(
  "book_authors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    embedUrl: text("embed_url"),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id),
  },
  (table) => ({
    uniqueAuthor: unique("uniqueAuthor").on(table.name, table.subjectId),
  })
);

export const chapter = pgTable(
  "chapters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    bookAuthorId: uuid("book_author_id")
      .notNull()
      .references(() => bookAuthor.id),
  },
  (table) => ({
    uniqueChapter: unique("uniqueChapter").on(table.name, table.bookAuthorId),
  })
);

export const post = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapter.id),
  page: integer("page").notNull(),
  imageUrl: text("image_url"),
  keywords: text("keywords").array(),
});

export * from "./auth";
