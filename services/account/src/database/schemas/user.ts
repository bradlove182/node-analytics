import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { passwordTable } from "./password"
import { sessionTable } from "./session"
import { teamUsers } from "./team"

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
    teams: many(teamUsers),
    sessions: many(sessionTable),
}))
