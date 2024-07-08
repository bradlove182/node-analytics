import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    password_hash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);

export const sessionSelectSchema = createSelectSchema(sessionTable);
export const sessionInsertSchema = createInsertSchema(sessionTable);

export type User = z.infer<typeof userSelectSchema>;
export type Session = z.infer<typeof sessionSelectSchema>;
