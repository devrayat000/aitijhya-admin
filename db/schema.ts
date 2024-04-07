import {
  text,
  integer,
  pgTable,
  uuid,
  unique,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

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
      .references(() => subject.id, { onDelete: "cascade" }),
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
      .references(() => bookAuthor.id, { onDelete: "cascade" }),
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
    .references(() => chapter.id, { onDelete: "cascade" }),
  page: integer("page").notNull(),
  imageUrl: text("image_url"),
  keywords: text("keywords").array(),
});

export const searchHistory = pgTable("search_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  query: text("query").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookmark = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export * from "./auth";
