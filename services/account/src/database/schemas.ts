import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
})

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
})

export const passwordTable = pgTable("password", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    password_hash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
})

export const organizationTable = pgTable("organization", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
})
export const projectTable = pgTable("project", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    organizationId: text("organization_id")
        .notNull()
        .references(() => organizationTable.id),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
})

// Relations
export const usersToOrganizations = pgTable(
    "users_to_organizations",
    {
        userId: text("user_id")
            .notNull()
            .references(() => userTable.id),
        organizationId: text("organization_id")
            .notNull()
            .references(() => organizationTable.id),
    },
    t => ({
        pk: primaryKey({ columns: [t.userId, t.organizationId] }),
    }),
)
export const userTableRelations = relations(userTable, ({ one, many }) => ({
    password: one(passwordTable, {
        fields: [userTable.id],
        references: [passwordTable.userId],
    }),
    usersToOrganizations: many(usersToOrganizations),
}))

export const organizationTableRelations = relations(organizationTable, ({ many }) => ({
    usersToOrganizations: many(usersToOrganizations),
}))

export const usersToOrganizationsRelations = relations(usersToOrganizations, ({ one }) => ({
    organization: one(organizationTable, {
        fields: [usersToOrganizations.organizationId],
        references: [organizationTable.id],
    }),
    user: one(userTable, {
        fields: [usersToOrganizations.userId],
        references: [userTable.id],
    }),
}))

export const projectTableRelations = relations(projectTable, ({ one }) => ({
    organization: one(organizationTable, {
        fields: [projectTable.organizationId],
        references: [organizationTable.id],
    }),
}))

export const schema = {
    user: userTable,
    session: sessionTable,
    password: passwordTable,
    organization: organizationTable,
    project: projectTable,
    usersToOrganizations,
    usersToOrganizationsRelations,
    userTableRelations,
    organizationTableRelations,
    projectTableRelations,
}
