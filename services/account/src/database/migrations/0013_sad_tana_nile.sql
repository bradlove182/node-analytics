CREATE TABLE IF NOT EXISTS "team_users" (
	"user_id" text,
	"team_id" text,
	CONSTRAINT "team_users_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "organization" RENAME TO "team";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "organization_id" TO "team_id";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_organization_id_organization_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_users" ADD CONSTRAINT "team_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_users" ADD CONSTRAINT "team_users_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
