ALTER TABLE "races" ALTER COLUMN "type" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "races" ALTER COLUMN "source" SET DATA TYPE varchar(255);--> statement-breakpoint
DROP TYPE "public"."race_types";--> statement-breakpoint
DROP TYPE "public"."sources";