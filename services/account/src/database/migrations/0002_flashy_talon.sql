CREATE TABLE IF NOT EXISTS "otp" (
	"id" text PRIMARY KEY NOT NULL,
	"pin" text NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "otp" ADD CONSTRAINT "otp_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
