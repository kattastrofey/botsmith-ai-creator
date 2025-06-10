import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core tables for PostgreSQL
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

export const chatbots = pgTable("chatbots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  aiModel: text("ai_model").notNull().default("llama3.2"),
  personality: text("personality").notNull(),
  voiceEnabled: boolean("voice_enabled").default(false),
  autoResponses: boolean("auto_responses").default(false),
  isActive: boolean("is_active").default(true),
  embedCode: text("embed_code"),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  chatbotId: integer("chatbot_id").notNull(),
  name: text("name").notNull(),
  trigger: text("trigger").notNull(),
  steps: jsonb("steps").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

export const chatbotConversations = pgTable("chatbot_conversations", {
  id: serial("id").primaryKey(),
  chatbotId: integer("chatbot_id").notNull(),
  sessionId: text("session_id").notNull(),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

export const basicIntegrations = pgTable("basic_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  config: jsonb("config").notNull(),
  isConnected: boolean("is_connected").default(false),
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  chatbotId: integer("chatbot_id").notNull(),
  date: timestamp("date").notNull().$defaultFn(() => new Date()),
  conversationsCount: integer("conversations_count").default(0),
  messagesCount: integer("messages_count").default(0),
  responseTime: integer("response_time_ms").default(0),
  satisfactionRating: integer("satisfaction_rating").default(0),
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
});

