import { isAuthError } from "@supabase/supabase-js";
import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { loginSchema, pinSchema } from "./schema";

export const load: PageServerLoad = async () => {
    const loginForm = await superValidate(zod(loginSchema));
    const pinForm = await superValidate(zod(pinSchema));

    return {
        loginForm,
        pinForm,
    };
};

export const actions = {
    login: async ({ request, locals }) => {
        const loginForm = await superValidate(request, zod(loginSchema));

        if (!loginForm.valid) {
            return fail(400, { loginForm });
        }

        const { error } = await locals.supabase.auth.signInWithOtp({
            email: loginForm.data.email,
        });

        if (error && isAuthError(error)) {
            return fail(400, {
                error: {
                    status: error.status,
                    message: error.message,
                },
            });
        }

        return message(loginForm, "Login form submitted");
    },
    verifyOTP: async ({ request, locals }) => {
        const pinForm = await superValidate(request, zod(pinSchema));

        if (!pinForm.valid) {
            return fail(400, { pinForm });
        }

        const { error } = await locals.supabase.auth.verifyOtp({
            email: pinForm.data.email,
            token: pinForm.data.pin.join(""),
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

        return message(pinForm, "Pin form submitted");
    },
    resendOTP: async () => {
        console.log("resend");
    },
} satisfies Actions;
