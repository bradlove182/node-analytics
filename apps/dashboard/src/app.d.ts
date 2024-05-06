// See https://kit.svelte.dev/docs/types#app

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
    namespace App {
        interface Locals {
            session: Session | null;
            user: User | null;
            supabase: SupabaseClient;
            safeGetSession: () => Promise<
                { session: null; user: null } | { session: Session; user: User | null }
            >;
        }
        interface Error {
            code?: string | number;
            errorId?: string;
            message?: string;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
