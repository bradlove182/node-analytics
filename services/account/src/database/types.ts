import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessionTable, userTable } from "./schemas";

export const userSelectSchema = createSelectSchema(userTable);
export const userInsertSchema = createInsertSchema(userTable);

export const sessionSelectSchema = createSelectSchema(sessionTable);
export const sessionInsertSchema = createInsertSchema(sessionTable);

export type User = z.infer<typeof userSelectSchema>;
export type Session = z.infer<typeof sessionSelectSchema>;
