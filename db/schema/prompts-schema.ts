// db/schema/prompts-schema.ts
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define the folders table first
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  // Add the user_id column
  // Clerk user IDs are strings, and every prompt MUST belong to a user
  user_id: text("user_id").notNull(),
  folder_id: integer("folder_id").references(() => folders.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define relations between tables
export const promptsRelations = relations(prompts, ({ one }) => ({
  folder: one(folders, {
    fields: [prompts.folder_id],
    references: [folders.id],
  }),
}));

export const foldersRelations = relations(folders, ({ many }) => ({
  prompts: many(prompts),
}));

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;
export type SelectFolder = typeof folders.$inferSelect;
