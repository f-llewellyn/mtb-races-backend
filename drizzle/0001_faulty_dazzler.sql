CREATE TYPE "public"."race_types" AS ENUM('XC', 'Enduro', 'Downhill');--> statement-breakpoint
CREATE TYPE "public"."sources" AS ENUM('Si Entries');--> statement-breakpoint
ALTER TABLE "races" ALTER COLUMN "type" TYPE "race_types" USING "type"::"race_types";--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "source" "sources";