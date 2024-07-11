import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
});

export const userTableRelations = relations(userTable, ({ one }) => ({
    password: one(passwordTable, {
        fields: [userTable.id],
        references: [passwordTable.userId],
    }),
}));

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

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
});

export const schema = {
    user: userTable,
    session: sessionTable,
    password: passwordTable,
    userTableRelations,
};
