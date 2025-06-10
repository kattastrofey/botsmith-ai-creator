import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { ProductionStorage } from "./storage-prod.js";

// Initialize production storage
const storage = new ProductionStorage();

// In-memory storage for conversation sessions
const conversationSessions = new Map<string, {
  currentTemplate: string | null;
  agentProfile: Record<string, any>;
  agentCreationStage: number;
  templates: Record<string, any>;
}>>();

