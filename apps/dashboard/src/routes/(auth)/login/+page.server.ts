import { isAuthError } from "@supabase/supabase-js";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    login: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get("email");

        if (!email) {
            return fail(400, { email });
        }

        const { error } = await locals.supabase.auth.signInWithOtp({
            email: String(email),
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
        const email = formData.get("email");
        const pin = formData.get("pin");

        if (!email) {
            return fail(400, { email });
        }

        const { error } = await locals.supabase.auth.verifyOtp({
            email: String(email),
            token: String(pin),
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
