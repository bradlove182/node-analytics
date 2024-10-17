import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

export const organizationTable = pgTable("organization", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})
