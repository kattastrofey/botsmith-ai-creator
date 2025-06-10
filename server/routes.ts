import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

// In-memory storage for conversation sessions
const conversationSessions = new Map<string, {
  currentTemplate: string | null;
  agentProfile: Record<string, any>;
  agentCreationStage: number;
  templates: Record<string, any>;
}>();
import { insertChatbotSchema, insertWorkflowSchema, insertIntegrationSchema, type ChatMessage } from "@shared/schema";
import { llmManager } from "./llm-providers";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const chatSessions = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    const sessionId = req.url?.split('sessionId=')[1] || Math.random().toString(36);
    chatSessions.set(sessionId, ws);

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await handleChatMessage(message, sessionId, ws);
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ error: 'Failed to process message' }));
      }
    });

    ws.on('close', () => {
      chatSessions.delete(sessionId);
    });
  });

  async function handleChatMessage(message: any, sessionId: string, ws: WebSocket) {
    const { type, content, chatbotId } = message;

    if (type === 'user_message') {
      // Get chatbot configuration
      const chatbot = await storage.getChatbot(chatbotId);
      if (!chatbot) {
        ws.send(JSON.stringify({ error: 'Chatbot not found' }));
        return;
      }

      // Get or create conversation
      let conversation = await storage.getConversationsBySessionId(sessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          chatbotId,
          sessionId,
          messages: [],
        });
      }

      // Add user message to conversation
      const userMessage: ChatMessage = {
        id: Math.random().toString(36),
        type: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      const currentMessages = Array.isArray(conversation.messages) ? conversation.messages as ChatMessage[] : [];
      currentMessages.push(userMessage);

      // Generate AI response using multi-provider system
      try {
        const systemPrompt = `You are ${chatbot.name}, a BotSmith assistant for a ${chatbot.industry} business. ${chatbot.personality}. Keep responses helpful and concise.`;
        
        const { provider, model } = llmManager.parseModelString(chatbot.aiModel || 'ollama:llama3.2');
        
        const aiContent = await llmManager.generateResponse(
          currentMessages.slice(-10),
          provider,
          model,
          systemPrompt
        );

        const aiMessage: ChatMessage = {
          id: Math.random().toString(36),
          type: 'bot',
          content: aiContent,
          timestamp: new Date().toISOString(),
        };

        currentMessages.push(aiMessage);
        await storage.updateConversation(conversation.id, currentMessages);

        // Send AI response back
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'bot_message',
            message: aiMessage,
          }));
        }

      } catch (error) {
        console.error('LLM Provider error:', error);
        const errorMessage: ChatMessage = {
          id: Math.random().toString(36),
          type: 'bot',
          content: 'I apologize, but I\'m experiencing technical difficulties. Please try again.',
          timestamp: new Date().toISOString(),
        };

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'bot_message',
            message: errorMessage,
          }));
        }
      }
    }
  }

  // Dashboard analytics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const stats = await storage.getAggregatedAnalytics(userId);
      
      res.json({
        activeChatbots: stats.totalChatbots,
        conversations: stats.totalConversations,
        automations: stats.totalAutomations,
        integrations: stats.totalIntegrations,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  // Chatbot routes
  app.get("/api/chatbots", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const chatbots = await storage.getChatbotsByUserId(userId);
      res.json(chatbots);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chatbots' });
    }
  });

  app.post("/api/chatbots", async (req, res) => {
    try {
      console.log('Received chatbot data:', req.body);
      const result = insertChatbotSchema.safeParse(req.body);
      if (!result.success) {
        console.log('Validation errors:', result.error.issues);
        return res.status(400).json({ error: 'Invalid chatbot data', details: result.error.issues });
      }

      const chatbotData = { 
        ...result.data, 
        userId: 1,
        voiceEnabled: result.data.voiceEnabled ?? false,
        autoResponses: result.data.autoResponses ?? false 
      }; // Demo user
      const chatbot = await storage.createChatbot(chatbotData);
      res.json(chatbot);
    } catch (error) {
      console.error('Chatbot creation error:', error);
      res.status(500).json({ error: 'Failed to create chatbot' });
    }
  });

  app.put("/api/chatbots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const chatbot = await storage.updateChatbot(id, updates);
      
      if (!chatbot) {
        return res.status(404).json({ error: 'Chatbot not found' });
      }
      
      res.json(chatbot);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update chatbot' });
    }
  });

  // Workflow routes
  app.get("/api/workflows/:chatbotId", async (req, res) => {
    try {
      const chatbotId = parseInt(req.params.chatbotId);
      const workflows = await storage.getWorkflowsByChatbotId(chatbotId);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch workflows' });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const result = insertWorkflowSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid workflow data', details: result.error });
      }

      const workflow = await storage.createWorkflow(result.data);
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create workflow' });
    }
  });

  // Integration routes
  app.get("/api/integrations", async (req, res) => {
    try {
      const userId = 1; // Demo user
      const integrations = await storage.getIntegrationsByUserId(userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch integrations' });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const result = insertIntegrationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid integration data', details: result.error });
      }

      const integrationData = { ...result.data, userId: 1 }; // Demo user
      const integration = await storage.createIntegration(integrationData);
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create integration' });
    }
  });

  app.put("/api/integrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const integration = await storage.updateIntegration(id, updates);
      
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update integration' });
    }
  });

  // LLM Providers route
  app.get("/api/llm-providers", async (req, res) => {
    try {
      const providers = llmManager.getAvailableProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch LLM providers' });
    }
  });

  // MCP Tools endpoints
  app.get("/api/mcp/tools", async (req, res) => {
    try {
      const { mcpManager } = await import('./mcp-client.js');
      const tools = mcpManager.getAllTools();
      res.json({ tools });
    } catch (error) {
      console.error('Error getting MCP tools:', error);
      res.status(500).json({ error: 'Failed to get MCP tools' });
    }
  });

  app.get("/api/mcp/resources", async (req, res) => {
    try {
      const { mcpManager } = await import('./mcp-client.js');
      const resources = mcpManager.getAllResources();
      res.json({ resources });
    } catch (error) {
      console.error('Error getting MCP resources:', error);
      res.status(500).json({ error: 'Failed to get MCP resources' });
    }
  });

  app.get("/api/mcp/status", async (req, res) => {
    try {
      const { mcpManager } = await import('./mcp-client.js');
      const status = mcpManager.getServerStatus();
      res.json({ status });
    } catch (error) {
      console.error('Error getting MCP status:', error);
      res.status(500).json({ error: 'Failed to get MCP status' });
    }
  });

  app.post("/api/mcp/execute-tool", async (req, res) => {
    try {
      const { toolName, parameters } = req.body;
      const { mcpManager } = await import('./mcp-client.js');
      const result = await mcpManager.executeTool(toolName, parameters);
      res.json({ result });
    } catch (error) {
      console.error('Error executing MCP tool:', error);
      res.status(500).json({ error: 'Failed to execute MCP tool' });
    }
  });

  app.get("/api/mcp/resource/:uri", async (req, res) => {
    try {
      const uri = decodeURIComponent(req.params.uri);
      const { mcpManager } = await import('./mcp-client.js');
      const resource = await mcpManager.getResource(uri);
      res.json({ resource });
    } catch (error) {
      console.error('Error getting MCP resource:', error);
      res.status(500).json({ error: 'Failed to get MCP resource' });
    }
  });

  // Analytics routes
  app.get("/api/analytics/:chatbotId", async (req, res) => {
    try {
      const chatbotId = parseInt(req.params.chatbotId);
      const analytics = await storage.getAnalyticsByChatbotId(chatbotId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Chat widget endpoint
  app.get("/widget.js", (req, res) => {
    const chatbotId = req.query.chatbotId || 'demo';
    const protocol = req.secure ? 'wss:' : 'ws:';
    const host = req.get('host');
    
    const widgetScript = `
      (function() {
        const chatbotId = '${chatbotId}';
        const wsUrl = '${protocol}//${host}/ws?sessionId=' + Math.random().toString(36);
        
        // Create chat widget HTML
        const widgetHTML = \`
          <div id="ai-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
            <div id="chat-bubble" style="width: 60px; height: 60px; background: #2563eb; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div id="chat-window" style="display: none; position: absolute; bottom: 70px; right: 0; width: 350px; height: 500px; background: white; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.3); overflow: hidden;">
              <div style="background: #2563eb; color: white; padding: 15px; font-weight: bold;">BotSmith</div>
              <div id="chat-messages" style="height: 400px; overflow-y: auto; padding: 15px;"></div>
              <div style="padding: 15px; border-top: 1px solid #eee;">
                <div style="display: flex; gap: 10px;">
                  <input type="text" id="chat-input" placeholder="Type a message..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; outline: none;">
                  <button id="send-btn" style="padding: 10px 15px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">Send</button>
                </div>
              </div>
            </div>
          </div>
        \`;
        
        // Insert widget into page
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        
        // Widget functionality
        const bubble = document.getElementById('chat-bubble');
        const window = document.getElementById('chat-window');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const messages = document.getElementById('chat-messages');
        
        let ws = null;
        let isOpen = false;
        
        function connectWebSocket() {
          ws = new WebSocket(wsUrl);
          
          ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'bot_message') {
              addMessage(data.message.content, 'bot');
            }
          };
        }
        
        function addMessage(content, type) {
          const messageDiv = document.createElement('div');
          messageDiv.style.marginBottom = '10px';
          messageDiv.innerHTML = \`
            <div style="background: \${type === 'user' ? '#2563eb' : '#f1f1f1'}; color: \${type === 'user' ? 'white' : 'black'}; padding: 10px; border-radius: 10px; max-width: 80%; margin-left: \${type === 'user' ? 'auto' : '0'};">
              \${content}
            </div>
          \`;
          messages.appendChild(messageDiv);
          messages.scrollTop = messages.scrollHeight;
        }
        
        function sendMessage() {
          const message = input.value.trim();
          if (message && ws && ws.readyState === WebSocket.OPEN) {
            addMessage(message, 'user');
            ws.send(JSON.stringify({
              type: 'user_message',
              content: message,
              chatbotId: chatbotId
            }));
            input.value = '';
          }
        }
        
        bubble.onclick = function() {
          isOpen = !isOpen;
          window.style.display = isOpen ? 'block' : 'none';
          if (isOpen && !ws) {
            connectWebSocket();
            addMessage('Hello! How can I help you today?', 'bot');
          }
        };
        
        sendBtn.onclick = sendMessage;
        input.onkeypress = function(e) {
          if (e.key === 'Enter') sendMessage();
        };
      })();
    `;
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(widgetScript);
  });

  // Enhanced conversation flow endpoints
  app.post("/api/conversation/message", async (req, res) => {
    try {
      const { userMessage, sessionId } = req.body;
      
      // Import conversation logic
      const { getResponse } = await import('./conversation-logic.js');
      
      // Get or create session state
      let sessionState = conversationSessions.get(sessionId) || {
        currentTemplate: null,
        agentProfile: {},
        agentCreationStage: 0,
        templates: {
          'Business Coach': { suggestedTasks: ['Strategy planning', 'Goal setting', 'Performance tracking'] },
          'Personal Assistant': { suggestedTasks: ['Schedule management', 'Email handling', 'Task organization'] },
          'Creative Partner': { suggestedTasks: ['Brainstorming', 'Content creation', 'Design feedback'] },
          'Health & Wellness Guide': { suggestedTasks: ['Workout planning', 'Nutrition advice', 'Wellness tracking'] },
          'Learning Companion': { suggestedTasks: ['Study planning', 'Skill development', 'Progress tracking'] },
          'Financial Advisor': { suggestedTasks: ['Budget planning', 'Investment advice', 'Expense tracking'] },
          'Home Manager': { suggestedTasks: ['Cleaning schedules', 'Maintenance reminders', 'Organization'] },
          'Entertainment Curator': { suggestedTasks: ['Content recommendations', 'Event planning', 'Activity suggestions'] },
          'Custom Agent': { suggestedTasks: ['Custom task 1', 'Custom task 2', 'Custom task 3'] }
        }
      };
      
      // Process the message through conversation logic
      const result = getResponse(
        userMessage,
        sessionState.currentTemplate,
        sessionState.agentProfile,
        sessionState.agentCreationStage,
        sessionState.templates
      );
      
      // Update session state
      if (result.newTemplate) sessionState.currentTemplate = result.newTemplate;
      if (result.newProfile) sessionState.agentProfile = result.newProfile;
      if (result.newStage !== null) sessionState.agentCreationStage = result.newStage;
      
      conversationSessions.set(sessionId, sessionState);
      
      // If agent creation is complete, save to database
      if (result.showPreview && sessionState.agentCreationStage === 17) {
        const { generatePersonalityPrompt } = await import('./conversation-logic.js');
        const personalityPrompt = generatePersonalityPrompt(sessionState.agentProfile);
        
        const chatbotData = {
          name: sessionState.agentProfile.name,
          industry: sessionState.agentProfile.profession || 'General',
          aiModel: 'ollama:llama3.2',
          personality: personalityPrompt,
          voiceEnabled: false,
          autoResponses: false
        };
        
        try {
          const newChatbot = await storage.createChatbot(chatbotData);
          result.createdChatbotId = newChatbot.id;
        } catch (error) {
          console.error('Error creating chatbot:', error);
        }
      }
      
      res.json({
        messages: result.messages,
        showPreview: result.showPreview,
        agentProfile: sessionState.agentProfile,
        createdChatbotId: result.createdChatbotId || null
      });
      
    } catch (error) {
      console.error('Error in conversation:', error);
      res.status(500).json({ error: 'Failed to process conversation' });
    }
  });
  
  app.get("/api/conversation/templates", async (req, res) => {
    try {
      const { getTemplateOptions } = await import('./conversation-logic.js');
      const templates = getTemplateOptions();
      res.json({ templates });
    } catch (error) {
      console.error('Error getting templates:', error);
      res.status(500).json({ error: 'Failed to get templates' });
    }
  });
  
  app.post("/api/conversation/reset", async (req, res) => {
    try {
      const { sessionId } = req.body;
      conversationSessions.delete(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error resetting conversation:', error);
      res.status(500).json({ error: 'Failed to reset conversation' });
    }
  });
  
  app.get("/api/conversation/session/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const sessionState = conversationSessions.get(sessionId);
      
      if (!sessionState) {
        res.json({ exists: false });
        return;
      }
      
      const { generateAgentSummary } = await import('./conversation-logic.js');
      const summary = generateAgentSummary(sessionState.agentProfile);
      
      res.json({
        exists: true,
        currentStage: sessionState.agentCreationStage,
        agentProfile: sessionState.agentProfile,
        summary
      });
    } catch (error) {
      console.error('Error getting session:', error);
      res.status(500).json({ error: 'Failed to get session' });
    }
  });

  // Serve the enhanced conversation page
  app.get("/enhanced-conversation", (req, res) => {
    res.sendFile('index.html', { root: 'dist/public' });
  });

  return httpServer;
}
