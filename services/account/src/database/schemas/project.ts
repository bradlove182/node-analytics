import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { organizationTable } from "./organization";

export const projectTable = pgTable("project", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    organizationId: text("organization_id").notNull().references(() => organizationTable.id),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})