CREATE TABLE IF NOT EXISTS "users_to_organizations" (
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	CONSTRAINT "users_to_organizations_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_organizations" ADD CONSTRAINT "users_to_organizations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_organizations" ADD CONSTRAINT "users_to_organizations_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
