import { db } from "./db";
import { 
  users, chatbots, workflows, conversations, integrations, analytics, basicIntegrations,
  type User, type InsertUser,
  type Chatbot, type InsertChatbot,
  type Workflow, type InsertWorkflow,
  type Conversation, type InsertConversation,
  type Integration, type InsertIntegration,
  type Analytics, type InsertAnalytics,
  type ChatMessage
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Chatbots
  async getChatbot(id: number): Promise<Chatbot | undefined> {
    const result = await db.select().from(chatbots).where(eq(chatbots.id, id)).limit(1);
    return result[0];
  }

  async getChatbotsByUserId(userId: number): Promise<Chatbot[]> {
    return await db.select().from(chatbots).where(eq(chatbots.userId, userId));
  }

  async createChatbot(chatbot: InsertChatbot): Promise<Chatbot> {
    const result = await db.insert(chatbots).values(chatbot).returning();
    const createdChatbot = result[0];
    
    // Update embed code with actual ID
    const finalEmbedCode = `<script src="${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/widget.js" data-chatbot-id="${createdChatbot.id}"></script>`;
    const updated = await db.update(chatbots)
      .set({ embedCode: finalEmbedCode })
      .where(eq(chatbots.id, createdChatbot.id))
      .returning();
    
    return updated[0];
  }

  async updateChatbot(id: number, updates: Partial<Chatbot>): Promise<Chatbot | undefined> {
    const result = await db.update(chatbots)
      .set(updates)
      .where(eq(chatbots.id, id))
      .returning();
    return result[0];
  }

  async deleteChatbot(id: number): Promise<boolean> {
    const result = await db.delete(chatbots).where(eq(chatbots.id, id));
    return result.rowCount > 0;
  }

  // Workflows
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const result = await db.select().from(workflows).where(eq(workflows.id, id)).limit(1);
    return result[0];
  }

  async getWorkflowsByChatbotId(chatbotId: number): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.chatbotId, chatbotId));
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const result = await db.insert(workflows).values(workflow).returning();
    return result[0];
  }

  async updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const result = await db.update(workflows)
      .set(updates)
      .where(eq(workflows.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    const result = await db.delete(workflows).where(eq(workflows.id, id));
    return result.rowCount > 0;
  }

  // Conversations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result[0];
  }

  async getConversationsBySessionId(sessionId: string): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.sessionId, sessionId)).limit(1);
    return result[0];
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async updateConversation(id: number, messages: ChatMessage[]): Promise<Conversation | undefined> {
    const result = await db.update(conversations)
      .set({ messages })
      .where(eq(conversations.id, id))
      .returning();
    return result[0];
  }

  // Integrations
  async getIntegration(id: number): Promise<Integration | undefined> {
    const result = await db.select().from(integrations).where(eq(integrations.id, id)).limit(1);
    return result[0];
  }

  async getIntegrationsByUserId(userId: number): Promise<Integration[]> {
    return await db.select().from(integrations).where(eq(integrations.userId, userId));
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const result = await db.insert(integrations).values(integration).returning();
    return result[0];
  }

  async updateIntegration(id: number, updates: Partial<Integration>): Promise<Integration | undefined> {
    const result = await db.update(integrations)
      .set(updates)
      .where(eq(integrations.id, id))
      .returning();
    return result[0];
  }

  async deleteIntegration(id: number): Promise<boolean> {
    const result = await db.delete(integrations).where(eq(integrations.id, id));
    return result.rowCount > 0;
  }

  // Analytics
  async getAnalyticsByChatbotId(chatbotId: number): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.chatbotId, chatbotId));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const result = await db.insert(analytics).values(analyticsData).returning();
    return result[0];
  }

  async getAggregatedAnalytics(userId: number): Promise<{
    totalChatbots: number;
    totalConversations: number;
    totalAutomations: number;
    totalIntegrations: number;
  }> {
    const userChatbots = await this.getChatbotsByUserId(userId);
    const userIntegrations = await this.getIntegrationsByUserId(userId);
    
    let totalConversations = 0;
    let totalAutomations = 0;
    
    for (const chatbot of userChatbots) {
      const conversationResults = await db.select().from(conversations).where(eq(conversations.chatbotId, chatbot.id));
      totalConversations += conversationResults.length;
      
      const workflowResults = await this.getWorkflowsByChatbotId(chatbot.id);
      totalAutomations += workflowResults.length;
    }

    return {
      totalChatbots: userChatbots.length,
      totalConversations,
      totalAutomations,
      totalIntegrations: userIntegrations.length,
    };
  }

  // Initialize with demo data
  async initializeDemoData(): Promise<void> {
    // Check if demo user exists
    const existingUser = await this.getUserByEmail("demo@example.com");
    if (existingUser) return; // Already initialized

    // Create demo user
    const demoUser = await this.createUser({
      username: "demo",
      email: "demo@example.com",
      password: "password",
    });

    // Create demo chatbot
    await this.createChatbot({
      userId: demoUser.id,
      name: "Support Assistant",
      industry: "E-commerce",
      aiModel: "llama3.2",
      personality: "Friendly and helpful customer support representative",
      voiceEnabled: true,
      autoResponses: true,
      isActive: true,
    });

    // Create demo integrations (using basic_integrations for now)
    await db.insert(basicIntegrations).values({
      userId: demoUser.id,
      name: "Salesforce",
      type: "crm",
      config: JSON.stringify({ apiKey: "demo", endpoint: "https://api.salesforce.com" }),
      isConnected: true,
    });

    await db.insert(basicIntegrations).values({
      userId: demoUser.id,
      name: "HubSpot",
      type: "marketing",
      config: JSON.stringify({ apiKey: "demo", endpoint: "https://api.hubapi.com" }),
      isConnected: true,
    });
  }
}