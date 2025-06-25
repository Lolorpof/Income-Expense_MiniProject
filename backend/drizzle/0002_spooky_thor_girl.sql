CREATE TABLE "money_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"total_spent" real DEFAULT 0 NOT NULL,
	"total_earned" real DEFAULT 0 NOT NULL,
	"net_total" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "money_list_per_day" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"time" time NOT NULL,
	"action" varchar(512) NOT NULL,
	"spent_or_earned" real DEFAULT 0 NOT NULL,
	"isSpent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"money_daily_id" uuid
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "money_daily" ADD CONSTRAINT "money_daily_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "money_list_per_day" ADD CONSTRAINT "money_list_per_day_money_daily_id_money_daily_id_fk" FOREIGN KEY ("money_daily_id") REFERENCES "public"."money_daily"("id") ON DELETE cascade ON UPDATE cascade;