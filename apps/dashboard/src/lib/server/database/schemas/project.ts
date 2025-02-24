import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./user"

export const project = pgTable("project", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})

export const projectUsers = pgTable("project_users", {
    userId: text("user_id").notNull().references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
    projectId: text("project_id").notNull().references(() => project.id, { onUpdate: "cascade", onDelete: "cascade" }),
}, table => ([
    primaryKey({ columns: [table.userId, table.projectId] }), // Composite primary key
]))

export const projectRelations = relations(project, ({ many }) => ({
    users: many(projectUsers),
}))

export const projectUsersRelations = relations(projectUsers, ({ one }) => ({
    user: one(user, { fields: [projectUsers.userId], references: [user.id] }),
    project: one(project, { fields: [projectUsers.projectId], references: [project.id] }),
}))
