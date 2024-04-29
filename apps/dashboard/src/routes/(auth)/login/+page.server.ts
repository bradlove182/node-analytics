import { error } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    login: async ({ request, locals }) => {
        const formData = await request.formData();
        const email = formData.get("email");

        if (!email) {
            return error(400, "Email is required.");
        }

        const { error: authError } = await locals.supabase.auth.signInWithOtp({
            email: String(email),
            options: {
                emailRedirectTo: "http://localhost:5173/otp",
            },
        });

        if (authError) {
            return error(400, authError.message);
        }

        return { success: true };
    },
} satisfies Actions;
