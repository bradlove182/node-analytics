ALTER TABLE "team_users" DROP CONSTRAINT "team_users_team_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "team_users" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_users" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_user_id_team_id_pk" PRIMARY KEY("user_id","team_id");