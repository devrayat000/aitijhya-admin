import {
  text,
  integer,
  pgTable,
  uuid,
  unique,
  timestamp,
  boolean,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const subject = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subjectRelations = relations(subject, ({ many }) => ({
  books: many(bookAuthor),
  ads: many(adsToSubjects),
}));

export const bookAuthor = pgTable(
  "book_authors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    edition: text("edition").notNull().default("2024"),
    marked: boolean("marked").notNull().default(false),
    coverUrl: text("cover_url"),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueBook: unique("uniqueBook").on(
      table.name,
      table.edition,
      table.marked,
      table.subjectId
    ),
  })
);

export const bookAuthorRelations = relations(bookAuthor, ({ one, many }) => ({
  subject: one(subject, {
    fields: [bookAuthor.subjectId],
    references: [subject.id],
  }),
  chapters: many(chapter),
}));

export const chapter = pgTable(
  "chapters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    bookAuthorId: uuid("book_author_id")
      .notNull()
      .references(() => bookAuthor.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueChapter: unique("uniqueChapter").on(table.name, table.bookAuthorId),
  })
);

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  book: one(bookAuthor, {
    fields: [chapter.bookAuthorId],
    references: [bookAuthor.id],
  }),
  posts: many(post),
}));

export const post = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  page: integer("page"),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapter.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postRelations = relations(post, ({ one }) => ({
  chapter: one(chapter, {
    fields: [post.chapterId],
    references: [chapter.id],
  }),
}));

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

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(users, {
    fields: [bookmark.userId],
    references: [users.id],
  }),
  post: one(post, {
    fields: [bookmark.postId],
    references: [post.id],
  }),
}));

export const ad = pgTable("ads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  link: text("link").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  classes: text("classes").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adsToSubjects = pgTable(
  "ads_to_subjects",
  {
    adId: uuid("ad_id")
      .notNull()
      .references(() => ad.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.adId, table.subjectId],
      name: "ad_subject_pk",
    }),
  })
);

export const adsRelations = relations(ad, ({ many }) => ({
  subjects: many(adsToSubjects),
}));

export const adsToSubjectsRelations = relations(adsToSubjects, ({ one }) => ({
  ad: one(ad, {
    fields: [adsToSubjects.adId],
    references: [ad.id],
  }),
  subject: one(subject, {
    fields: [adsToSubjects.subjectId],
    references: [subject.id],
  }),
}));

export * from "./auth";
