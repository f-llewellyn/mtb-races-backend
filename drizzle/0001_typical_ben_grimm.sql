ALTER TABLE "races" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;