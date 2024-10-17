import { organizationTable } from "./organization"
import { passwordTable } from "./password"
import { projectTable } from "./project"
import { sessionTable, sessionTableRelations } from "./session"
import { userTable, userTableRelations } from "./user"

export const schema = {
    user: userTable,
    session: sessionTable,
    password: passwordTable,
    organization: organizationTable,
    project: projectTable,
    userTableRelations,
    sessionTableRelations,
}
