import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { projectTable } from "./project"
import { userTable } from "./user"

export const teamTable = pgTable("team", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})

export const teamUsers = pgTable("team_users", {
    userId: text("user_id").notNull().references(() => userTable.id),
    teamId: text("team_id").notNull().references(() => teamTable.id),
}, table => ({
    pk: primaryKey({ columns: [table.userId, table.teamId] }), // Composite primary key
}))

export const teamTableRelations = relations(teamTable, ({ many }) => ({
    users: many(teamUsers),
    projects: many(projectTable),
}))

export const teamUsersRelations = relations(teamUsers, ({ one }) => ({
    user: one(userTable, { fields: [teamUsers.userId], references: [userTable.id] }),
    team: one(teamTable, { fields: [teamUsers.teamId], references: [teamTable.id] }),
}))
