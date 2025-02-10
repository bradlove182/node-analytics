CREATE TABLE "google" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"google_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "google" ADD CONSTRAINT "google_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;