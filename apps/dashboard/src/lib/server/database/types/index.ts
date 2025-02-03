import { user, session } from "$lib/server/database/schemas";

export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect