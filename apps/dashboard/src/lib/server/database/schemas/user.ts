import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { github } from "./github"
import { session } from "./session"

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})

export const userRelations = relations(user, ({ one, many }) => ({
    sessions: many(session),
    github: one(github, { fields: [user.id], references: [github.userId] }),
}))
