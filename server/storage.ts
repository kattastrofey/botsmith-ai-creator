import { 
  users, chatbots, workflows, conversations, integrations, analytics,
  type User, type InsertUser,
  type Chatbot, type InsertChatbot,
  type Workflow, type InsertWorkflow,
  type Conversation, type InsertConversation,
  type Integration, type InsertIntegration,
  type Analytics, type InsertAnalytics,
  type ChatMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Chatbots
  getChatbot(id: number): Promise<Chatbot | undefined>;
  getChatbotsByUserId(userId: number): Promise<Chatbot[]>;
  createChatbot(chatbot: InsertChatbot): Promise<Chatbot>;
  updateChatbot(id: number, updates: Partial<Chatbot>): Promise<Chatbot | undefined>;
  deleteChatbot(id: number): Promise<boolean>;

  // Workflows
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflowsByChatbotId(chatbotId: number): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;

  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationsBySessionId(sessionId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, messages: ChatMessage[]): Promise<Conversation | undefined>;

  // Integrations
  getIntegration(id: number): Promise<Integration | undefined>;
  getIntegrationsByUserId(userId: number): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, updates: Partial<Integration>): Promise<Integration | undefined>;
  deleteIntegration(id: number): Promise<boolean>;

  // Analytics
  getAnalyticsByChatbotId(chatbotId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAggregatedAnalytics(userId: number): Promise<{
    totalChatbots: number;
    totalConversations: number;
    totalAutomations: number;
    totalIntegrations: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private chatbots: Map<number, Chatbot> = new Map();
  private workflows: Map<number, Workflow> = new Map();
  private conversations: Map<number, Conversation> = new Map();
  private integrations: Map<number, Integration> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private currentId = 1;

  constructor() {
    // Initialize with demo user and data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUser: User = {
      id: 1,
      username: "demo",
      email: "demo@example.com",
      password: "password",
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);

    const demoChatbot: Chatbot = {
      id: 1,
      userId: 1,
      name: "Support Assistant",
      industry: "E-commerce",
      aiModel: "llama3.2",
      personality: "Friendly and helpful customer support representative",
      voiceEnabled: true,
      autoResponses: true,
      isActive: true,
      embedCode: '<script src="https://yoursite.com/widget.js" data-chatbot-id="abc123"></script>',
      createdAt: new Date(),
    };
    this.chatbots.set(1, demoChatbot);

    const demoIntegrations: Integration[] = [
      {
        id: 1,
        userId: 1,
        name: "Salesforce",
        type: "crm",
        config: { apiKey: "demo", endpoint: "https://api.salesforce.com" },
        isConnected: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        name: "HubSpot",
        type: "marketing",
        config: { apiKey: "demo", endpoint: "https://api.hubapi.com" },
        isConnected: true,
        createdAt: new Date(),
      },
    ];
    demoIntegrations.forEach(integration => this.integrations.set(integration.id, integration));

    this.currentId = 10;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Chatbots
  async getChatbot(id: number): Promise<Chatbot | undefined> {
    return this.chatbots.get(id);
  }

  async getChatbotsByUserId(userId: number): Promise<Chatbot[]> {
    return Array.from(this.chatbots.values()).filter(chatbot => chatbot.userId === userId);
  }

  async createChatbot(insertChatbot: InsertChatbot): Promise<Chatbot> {
    const id = this.currentId++;
    const embedCode = `<script src="${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/widget.js" data-chatbot-id="${id}"></script>`;
    const chatbot: Chatbot = { 
      id,
      userId: insertChatbot.userId || 1,
      name: insertChatbot.name,
      industry: insertChatbot.industry,
      aiModel: insertChatbot.aiModel || "llama3.2",
      personality: insertChatbot.personality,
      voiceEnabled: insertChatbot.voiceEnabled ?? false,
      autoResponses: insertChatbot.autoResponses ?? false,
      isActive: insertChatbot.isActive ?? true,
      embedCode,
      createdAt: new Date() 
    };
    this.chatbots.set(id, chatbot);
    return chatbot;
  }

  async updateChatbot(id: number, updates: Partial<Chatbot>): Promise<Chatbot | undefined> {
    const chatbot = this.chatbots.get(id);
    if (!chatbot) return undefined;
    const updated = { ...chatbot, ...updates };
    this.chatbots.set(id, updated);
    return updated;
  }

  async deleteChatbot(id: number): Promise<boolean> {
    return this.chatbots.delete(id);
  }

  // Workflows
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getWorkflowsByChatbotId(chatbotId: number): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(workflow => workflow.chatbotId === chatbotId);
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.currentId++;
    const workflow: Workflow = { ...insertWorkflow, id, createdAt: new Date() };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    const updated = { ...workflow, ...updates };
    this.workflows.set(id, updated);
    return updated;
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    return this.workflows.delete(id);
  }

  // Conversations
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsBySessionId(sessionId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(conv => conv.sessionId === sessionId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentId++;
    const conversation: Conversation = { ...insertConversation, id, createdAt: new Date() };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, messages: ChatMessage[]): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    const updated = { ...conversation, messages };
    this.conversations.set(id, updated);
    return updated;
  }

  // Integrations
  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getIntegrationsByUserId(userId: number): Promise<Integration[]> {
    return Array.from(this.integrations.values()).filter(integration => integration.userId === userId);
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = this.currentId++;
    const integration: Integration = { ...insertIntegration, id, createdAt: new Date() };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: number, updates: Partial<Integration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    const updated = { ...integration, ...updates };
    this.integrations.set(id, updated);
    return updated;
  }

  async deleteIntegration(id: number): Promise<boolean> {
    return this.integrations.delete(id);
  }

  // Analytics
  async getAnalyticsByChatbotId(chatbotId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.chatbotId === chatbotId);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentId++;
    const analytics: Analytics = { ...insertAnalytics, id };
    this.analytics.set(id, analytics);
    return analytics;
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
      const conversations = Array.from(this.conversations.values()).filter(conv => conv.chatbotId === chatbot.id);
      totalConversations += conversations.length;
      
      const workflows = await this.getWorkflowsByChatbotId(chatbot.id);
      totalAutomations += workflows.length;
    }

    return {
      totalChatbots: userChatbots.length,
      totalConversations,
      totalAutomations,
      totalIntegrations: userIntegrations.length,
    };
  }
}

import { DatabaseStorage } from "./db-storage";

export const storage = new DatabaseStorage();

// Initialize demo data
storage.initializeDemoData().catch(console.error);
