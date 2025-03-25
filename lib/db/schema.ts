import {
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    jsonb
  } from "drizzle-orm/pg-core";
  
  export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);
  
  export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    pdfName: text("pdf_name").notNull(),
    pdfUrl: text("pdf_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fileKey: text("file_key").notNull(),
  });
  
  export type DrizzleChat = typeof chats.$inferSelect;
  
  export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    chatId: integer("chat_id")
      .references(() => chats.id, { onDelete: "cascade" }) // ✅ Enable cascade delete
      .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    role: userSystemEnum("role").notNull(),
  });

  export const flashcards = pgTable("flashcards", {
    id: serial("id").primaryKey(),
    chatId: text("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    tags: jsonb("tags").default([]),
    topic: text("topic"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  })
  
  // New schema for annotations
  export const annotations = pgTable("annotations", {
    id: serial("id").primaryKey(),
    chatId: text("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id").notNull(),
    type: text("type").notNull(), // "highlight", "note", "bookmark"
    pageNumber: integer("page_number").notNull(),
    position: jsonb("position").notNull(), // { x, y }
    color: text("color"),
    text: text("text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  })
  
  
  
  // export const userSubscriptions = pgTable("user_subscriptions", {
  //   id: serial("id").primaryKey(),
  //   userId: varchar("user_id", { length: 256 }).notNull().unique(),
  //   stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
  //     .notNull()
  //     .unique(),
  //   stripeSubscriptionId: varchar("stripe_subscription_id", {
  //     length: 256,
  //   }).unique(),
  //   stripePriceId: varchar("stripe_price_id", { length: 256 }),
  //   stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
  // });
  
  // drizzle-orm
  // drizzle-kit
  