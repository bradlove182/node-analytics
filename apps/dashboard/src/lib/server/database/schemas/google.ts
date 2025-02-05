import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"
import { user } from "./user"

export const google = pgTable("google", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    googleId: text("google_id").notNull(),
})

export const googleRelations = relations(google, ({ one }) => ({
    user: one(user, { fields: [google.userId], references: [user.id] }),
}))
