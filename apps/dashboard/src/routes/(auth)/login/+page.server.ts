import { isAuthError } from "@supabase/supabase-js";
import { fail } from "@sveltejs/kit";
import { superValidate, type Infer } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { loginSchema } from "./schema";

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(loginSchema));

    return { form };
};

export const actions = {
    login: async ({ request, locals }) => {
        const form = await superValidate(request, zod(loginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { error } = await locals.supabase.auth.signInWithOtp({
            email: form.data.email,
            options: {
                // set this to false if you do not want the user to be automatically signed up
                shouldCreateUser: true,
            },
        });

        if (error && isAuthError(error)) {
            console.error(error);
            return fail(400, {
                form,
                error: {
                    status: error.status,
                    message: error.message,
                },
            });
        }

        return { form };
    },
} satisfies Actions;
