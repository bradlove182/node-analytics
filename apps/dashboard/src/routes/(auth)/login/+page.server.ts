import { isAuthError } from "@supabase/supabase-js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { loginSchema } from "./schema";

export const actions = {
    login: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get("email")?.toString();

        if (!email) {
            return fail(400, { email });
        }

        const { error } = await locals.supabase.auth.signInWithOtp({
            email,
        });

        if (error && isAuthError(error)) {
            return fail(400, {
                error: {
                    status: error.status,
                    message: error.message,
                },
            });
        }

        return { email };
    },
    verifyOTP: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get("email")?.toString();
        const pin = formData.get("pin")?.toString();

        if (!email || !pin) {
            return fail(400, { email, pin });
        }

        const { error } = await locals.supabase.auth.verifyOtp({
            email,
            token: pin,
            type: "magiclink",
        });

        if (error && isAuthError(error)) {
            return fail(400, {
                error: {
                    status: error.status,
                    message: error.message,
                },
            });
        }

        return { email, pin };
    },
} satisfies Actions;

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(loginSchema)),
    };
};
