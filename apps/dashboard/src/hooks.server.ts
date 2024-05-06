import { env } from "@repo/environment";
import { createServerClient } from "@supabase/ssr";
import { redirect, type Handle, type HandleServerError } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const supabase: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_KEY, {
        auth: {
            flowType: "pkce",
        },
        cookies: {
            get: (key) => event.cookies.get(key),
            set: (key, value, options) => {
                event.cookies.set(key, value, { ...options, path: "/" });
            },
            remove: (key, options) => {
                event.cookies.delete(key, { ...options, path: "/" });
            },
        },
    });

    event.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        if (!session) {
            return { session: null, user: null };
        }

        const {
            data: { user },
            error,
        } = await event.locals.supabase.auth.getUser();
        if (error) {
            // JWT validation has failed
            return { session: null, user: null };
        }

        return { session, user };
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            /**
             * Supabase libraries use the `content-range` header, so we need to
             * tell SvelteKit to pass it through.
             */
            return name === "content-range";
        },
    });
};

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession();
    event.locals.session = session;
    event.locals.user = user;

    if (!event.locals.session && event.url.pathname === "/") {
        return redirect(303, "/login");
    }

    if (event.locals.session && event.url.pathname === "/login") {
        return redirect(303, "/");
    }

    return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);

export const handleError: HandleServerError = async ({ error, status, message }) => {
    const errorId = crypto.randomUUID();

    console.error(status, message);
    console.error(error);

    return {
        code: status,
        message: "An unexpected error occurred. We are working on it.",
        errorId,
    };
};
