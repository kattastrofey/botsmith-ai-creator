import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { pgTable, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Detect database type from environment
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const isUsingSQLite = dbUrl.startsWith('file:');

// Helper functions for cross-database compatibility
const table = isUsingSQLite ? sqliteTable : pgTable;
const primaryKey = () => isUsingSQLite ? integer('id').primaryKey({ autoIncrement: true }) : serial('id').primaryKey();
const textField = (name: string) => text(name);
const intField = (name: string) => integer(name);
const boolField = (name: string) => isUsingSQLite ? integer(name, { mode: 'boolean' }) : boolean(name);
const timestampField = (name: string) => isUsingSQLite ? integer(name, { mode: 'timestamp' }) : timestamp(name);
const jsonField = (name: string) => isUsingSQLite ? text(name) : jsonb(name);

// Core tables from original schema
export const users = table("users", {
  id: primaryKey(),
  username: textField("username").notNull().unique(),
  password: textField("password").notNull(),
  email: textField("email").notNull().unique(),
  createdAt: timestampField("created_at").notNull().$defaultFn(() => new Date()),
});

export const chatbots = table("chatbots", {
  id: primaryKey(),
  userId: intField("user_id").notNull(),
  name: textField("name").notNull(),
  industry: textField("industry").notNull(),
  aiModel: textField("ai_model").notNull().default("llama3.2"),
  personality: textField("personality").notNull(),
  voiceEnabled: boolField("voice_enabled").default(false),
  autoResponses: boolField("auto_responses").default(false),
  isActive: boolField("is_active").default(true),
  embedCode: textField("embed_code"),
  createdAt: timestampField("created_at").notNull().$defaultFn(() => new Date()),
});

export const workflows = table("workflows", {
  id: primaryKey(),
  chatbotId: intField("chatbot_id").notNull(),
  name: textField("name").notNull(),
  trigger: textField("trigger").notNull(),
  steps: jsonField("steps").notNull(),
  isActive: boolField("is_active").default(true),
  createdAt: timestampField("created_at").notNull().$defaultFn(() => new Date()),
});

// Rename existing conversations table to chatbot_conversations to avoid conflict
export const chatbotConversations = table("chatbot_conversations", {
  id: primaryKey(),
  chatbotId: intField("chatbot_id").notNull(),
  sessionId: textField("session_id").notNull(),
  messages: jsonField("messages").notNull(),
  createdAt: timestampField("created_at").notNull().$defaultFn(() => new Date()),
});

// Rename existing integrations table to basic_integrations to avoid conflict  
export const basicIntegrations = table("basic_integrations", {
  id: primaryKey(),
  userId: intField("user_id").notNull(),
  name: textField("name").notNull(),
  type: textField("type").notNull(),
  config: jsonField("config").notNull(),
  isConnected: boolField("is_connected").default(false),
  createdAt: timestampField("created_at").notNull().$defaultFn(() => new Date()),
});

export const analytics = table("analytics", {
  id: primaryKey(),
  chatbotId: intField("chatbot_id").notNull(),
  date: timestampField("date").notNull().$defaultFn(() => new Date()),
  conversationsCount: intField("conversations_count").default(0),
  messagesCount: intField("messages_count").default(0),
  responseTime: intField("response_time_ms").default(0),
  satisfactionRating: intField("satisfaction_rating").default(0),
});

// New tables from AICompanionPro schema
export const conversations = table("conversations", {
  id: primaryKey(),
  sessionId: textField("session_id").notNull().unique(),
  userId: textField("user_id"),
  currentStep: textField("current_step").notNull().default("initial"),
  selectedTemplate: textField("selected_template"),
  selectedProvider: textField("selected_provider").default("hume"),
  emotionalState: textField("emotional_state").default("neutral"),
  configuration: jsonField("configuration"),
  createdAt: timestampField("created_at").$defaultFn(() => new Date()),
  updatedAt: timestampField("updated_at").$defaultFn(() => new Date()),
});

export const messages = table("messages", {
  id: primaryKey(),
  conversationId: intField("conversation_id").notNull(),
  content: textField("content").notNull(),
  role: textField("role").notNull(), // "user" | "assistant" | "system"
  emotionalContext: jsonField("emotional_context"),
  voiceAnalysis: jsonField("voice_analysis"),
  timestamp: timestampField("timestamp").$defaultFn(() => new Date()),
});

export const templates = table("templates", {
  id: primaryKey(),
  name: textField("name").notNull(),
  category: textField("category").notNull(), // "business" | "personal" | "healthcare"
  subcategory: textField("subcategory").notNull(),
  description: textField("description").notNull(),
  icon: textField("icon").notNull(),
  color: textField("color").notNull(),
  timesSaved: textField("times_saved").notNull(),
  rating: intField("rating").notNull().default(5),
  userCount: intField("user_count").notNull().default(0),
  configuration: jsonField("configuration").notNull(),
  isActive: boolField("is_active").notNull().default(true),
});

// Universal Mental Health Automation Schema
export const mentalHealthSessions = table("mental_health_sessions", {
  id: primaryKey(),
  sessionId: textField("session_id").notNull().unique(),
  clientIdentifier: textField("client_identifier").notNull(), // flexible - can be any EMR's client ID
  providerIdentifier: textField("provider_identifier").notNull(),
  sessionDate: timestampField("session_date").notNull(),
  sessionType: textField("session_type").notNull(), // individual, group, family, etc.
  sessionDuration: intField("session_duration"), // minutes
  rawNotes: textField("raw_notes").notNull(),
  aiProcessedNotes: jsonField("ai_processed_notes"),
  diagnoses: textField("diagnoses"), // JSON string for SQLite compatibility
  interventions: textField("interventions"), // JSON string for SQLite compatibility
  emrIntegration: jsonField("emr_integration"),
  createdAt: timestampField("created_at").$defaultFn(() => new Date()),
  updatedAt: timestampField("updated_at").$defaultFn(() => new Date()),
});

export const insuranceClaimsAutomation = table("insurance_claims_automation", {
  id: primaryKey(),
  claimId: textField("claim_id").notNull().unique(),
  sessionId: textField("session_id").notNull(),
  clientIdentifier: textField("client_identifier").notNull(),
  providerIdentifier: textField("provider_identifier").notNull(),
  serviceDate: timestampField("service_date").notNull(),
  cptCode: textField("cpt_code").notNull(), // procedure code
  icdCode: textField("icd_code").notNull(), // diagnosis code
  chargeAmount: textField("charge_amount").notNull(), // decimal as text for precision
  payerInfo: jsonField("payer_info"),
  cms1500Data: jsonField("cms1500_data"),
  claimStatus: textField("claim_status").notNull().default("draft"), // draft, submitted, processing, paid, denied, resubmitted
  submissionData: jsonField("submission_data"),
  rejectionInfo: jsonField("rejection_info"),
  paymentInfo: jsonField("payment_info"),
  aiInsights: jsonField("ai_insights"),
  createdAt: timestampField("created_at").$defaultFn(() => new Date()),
  updatedAt: timestampField("updated_at").$defaultFn(() => new Date()),
});

export const aiProviders = table("ai_providers", {
  id: primaryKey(),
  name: textField("name").notNull(),
  type: textField("type").notNull(), // "ollama" | "hume" | "openai" | "anthropic"
  description: textField("description").notNull(),
  capabilities: jsonField("capabilities").notNull(),
  isLocal: boolField("is_local").notNull().default(false),
  requiresApiKey: boolField("requires_api_key").notNull().default(true),
  isActive: boolField("is_active").notNull().default(true),
});

// Integration Marketplace Schema
export const integrations = table("integrations", {
  id: primaryKey(),
  name: textField("name").notNull(),
  category: textField("category").notNull(), // "communication", "productivity", "social", "finance", etc.
  description: textField("description").notNull(),
  provider: textField("provider").notNull(), // "slack", "gmail", "twitter", etc.
  iconUrl: textField("icon_url").notNull(),
  color: textField("color").notNull(),
  isActive: boolField("is_active").notNull().default(true),
  requiresAuth: boolField("requires_auth").notNull().default(true),
  emotionalTriggers: jsonField("emotional_triggers"),
  configuration: jsonField("configuration"),
  popularity: intField("popularity").notNull().default(0),
  createdAt: timestampField("created_at").$defaultFn(() => new Date()),
});

export const userIntegrations = table("user_integrations", {
  id: primaryKey(),
  userId: textField("user_id").notNull(),
  integrationId: intField("integration_id").notNull(),
  isConnected: boolField("is_connected").notNull().default(false),
  connectionData: jsonField("connection_data"),
  emotionalSettings: jsonField("emotional_settings"),
  createdAt: timestampField("created_at").$defaultFn(() => new Date()),
  lastUsed: timestampField("last_used"),
});

export const emotionalTriggerLogs = table("emotional_trigger_logs", {
  id: primaryKey(),
  userIntegrationId: intField("user_integration_id").notNull(),
  sessionId: textField("session_id").notNull(),
  detectedEmotion: textField("detected_emotion").notNull(),
  emotionConfidence: intField("emotion_confidence").notNull(), // 0-100
  triggerAction: textField("trigger_action").notNull(),
  actionResult: jsonField("action_result"),
  timestamp: timestampField("timestamp").$defaultFn(() => new Date()),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChatbotSchema = createInsertSchema(chatbots).omit({
  id: true,
  embedCode: true,
  createdAt: true,
}).extend({
  userId: z.number().optional(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Chatbot = typeof chatbots.$inferSelect;
export type InsertChatbot = z.infer<typeof insertChatbotSchema>;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

// Message types for chat
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

// Workflow step types
export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}
