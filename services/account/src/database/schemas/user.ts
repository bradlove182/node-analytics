import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { organizationTable } from "./organization"
import { passwordTable } from "./password"
import { sessionTable } from "./session"

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})

export const userTableRelations = relations(userTable, ({ one, many }) => ({
    password: one(passwordTable),
    organizations: many(organizationTable),
    sessions: many(sessionTable),
}))
