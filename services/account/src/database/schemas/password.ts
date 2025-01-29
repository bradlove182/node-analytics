import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { userTable } from "./user"

export const passwordTable = pgTable("password", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    passwordHash: text("passwordHash").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})

export const passwordTableRelations = relations(passwordTable, ({ one }) => ({
    user: one(userTable, { fields: [passwordTable.userId], references: [userTable.id] }),
}))
