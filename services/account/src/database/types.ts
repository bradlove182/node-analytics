import type { InferSelectModel } from "drizzle-orm"
import type { organizationTable, sessionTable, userTable } from "./schemas"

export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>
export type Organization = InferSelectModel<typeof organizationTable>
