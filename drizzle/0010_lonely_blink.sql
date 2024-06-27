CREATE TABLE IF NOT EXISTS "ads_to_subjects" (
	"ad_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ad_subject_pk" PRIMARY KEY("ad_id","subject_id")
);
--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ads" ADD COLUMN "classes" text[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ads_to_subjects" ADD CONSTRAINT "ads_to_subjects_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ads_to_subjects" ADD CONSTRAINT "ads_to_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
