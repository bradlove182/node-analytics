import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { userTable } from "./user";

export const passwordTable = pgTable("password", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id),
    password_hash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})