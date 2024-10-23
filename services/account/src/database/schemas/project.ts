import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { teamTable } from "./team"

export const projectTable = pgTable("project", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    teamId: text("team_id").notNull().references(() => teamTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).notNull().defaultNow(),
})

export const projectTableRelations = relations(projectTable, ({ one }) => ({
    team: one(teamTable, { fields: [projectTable.teamId], references: [teamTable.id] }),
}))
