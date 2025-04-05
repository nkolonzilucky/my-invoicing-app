ALTER TABLE "invoices" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "email";