import { relations, sql } from "drizzle-orm"
import { pgPolicy, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./user"

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
}, () => [
    pgPolicy("get only users sessions", {
        as: "permissive",
        using: sql`user_id = current_user`,
    }),
])

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, { fields: [session.userId], references: [user.id] }),
}))
