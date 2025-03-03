import { z } from "zod"
import CreateProjectForm from "./CreateProjectForm.svelte"

export const createProjectFormSchema = z.object({
    name: z.string().min(2).max(50),
})

export type CreateProjectFormSchema = typeof createProjectFormSchema

export { CreateProjectForm }
