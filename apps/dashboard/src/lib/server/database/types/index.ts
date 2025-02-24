import type { github, google, project, session, user } from "$lib/server/database/schemas"

export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect
export type GitHub = typeof github.$inferSelect
export type Google = typeof google.$inferSelect
export type Project = typeof project.$inferSelect
