import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const libraries = sqliteTable("libraries", {
  userId: text("user_id").primaryKey(),
  payload: text("payload").notNull(),
  revision: integer("revision").notNull().default(0),
});
