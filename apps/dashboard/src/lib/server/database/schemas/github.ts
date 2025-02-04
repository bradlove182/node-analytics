import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"
import { user } from "./user"

export const github = pgTable("github", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    username: text("username").notNull(),
})

export const githubRelations = relations(github, ({ one }) => ({
    user: one(user, { fields: [github.userId], references: [user.id] }),
}))
