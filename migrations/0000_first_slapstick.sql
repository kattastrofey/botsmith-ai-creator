CREATE TABLE `ai_providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`capabilities` text NOT NULL,
	`is_local` integer DEFAULT false NOT NULL,
	`requires_api_key` integer DEFAULT true NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analytics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatbot_id` integer NOT NULL,
	`date` integer NOT NULL,
	`conversations_count` integer DEFAULT 0,
	`messages_count` integer DEFAULT 0,
	`response_time_ms` integer DEFAULT 0,
	`satisfaction_rating` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `basic_integrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`config` text NOT NULL,
	`is_connected` integer DEFAULT false,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chatbot_conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatbot_id` integer NOT NULL,
	`session_id` text NOT NULL,
	`messages` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chatbots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`industry` text NOT NULL,
	`ai_model` text DEFAULT 'llama3.2' NOT NULL,
	`personality` text NOT NULL,
	`voice_enabled` integer DEFAULT false,
	`auto_responses` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`embed_code` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text,
	`current_step` text DEFAULT 'initial' NOT NULL,
	`selected_template` text,
	`selected_provider` text DEFAULT 'hume',
	`emotional_state` text DEFAULT 'neutral',
	`configuration` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conversations_session_id_unique` ON `conversations` (`session_id`);--> statement-breakpoint
CREATE TABLE `emotional_trigger_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_integration_id` integer NOT NULL,
	`session_id` text NOT NULL,
	`detected_emotion` text NOT NULL,
	`emotion_confidence` integer NOT NULL,
	`trigger_action` text NOT NULL,
	`action_result` text,
	`timestamp` integer
);
--> statement-breakpoint
CREATE TABLE `insurance_claims_automation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`claim_id` text NOT NULL,
	`session_id` text NOT NULL,
	`client_identifier` text NOT NULL,
	`provider_identifier` text NOT NULL,
	`service_date` integer NOT NULL,
	`cpt_code` text NOT NULL,
	`icd_code` text NOT NULL,
	`charge_amount` text NOT NULL,
	`payer_info` text,
	`cms1500_data` text,
	`claim_status` text DEFAULT 'draft' NOT NULL,
	`submission_data` text,
	`rejection_info` text,
	`payment_info` text,
	`ai_insights` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `insurance_claims_automation_claim_id_unique` ON `insurance_claims_automation` (`claim_id`);--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`provider` text NOT NULL,
	`icon_url` text NOT NULL,
	`color` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`requires_auth` integer DEFAULT true NOT NULL,
	`emotional_triggers` text,
	`configuration` text,
	`popularity` integer DEFAULT 0 NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `mental_health_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`client_identifier` text NOT NULL,
	`provider_identifier` text NOT NULL,
	`session_date` integer NOT NULL,
	`session_type` text NOT NULL,
	`session_duration` integer,
	`raw_notes` text NOT NULL,
	`ai_processed_notes` text,
	`diagnoses` text,
	`interventions` text,
	`emr_integration` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mental_health_sessions_session_id_unique` ON `mental_health_sessions` (`session_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conversation_id` integer NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`emotional_context` text,
	`voice_analysis` text,
	`timestamp` integer
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`subcategory` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`times_saved` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`user_count` integer DEFAULT 0 NOT NULL,
	`configuration` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_integrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`integration_id` integer NOT NULL,
	`is_connected` integer DEFAULT false NOT NULL,
	`connection_data` text,
	`emotional_settings` text,
	`created_at` integer,
	`last_used` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatbot_id` integer NOT NULL,
	`name` text NOT NULL,
	`trigger` text NOT NULL,
	`steps` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer NOT NULL
);
