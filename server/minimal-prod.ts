import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Basic API routes that don't depend on complex database operations
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'BotSmith API is running!' });
});

// Serve static files from the dist/public directory
const distPath = path.resolve(process.cwd(), 'dist', 'public');

if (!fs.existsSync(distPath)) {
  console.error(`Build directory not found: ${distPath}`);
  process.exit(1);
}

app.use(express.static(distPath));

// Catch-all handler: serve index.html for any non-API routes
app.use('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = '0.0.0.0';

server.listen(port, host, () => {
  console.log(`🚀 BotSmith server running on ${host}:${port}`);
  console.log(`📁 Serving static files from: ${distPath}`);
  console.log(`🔗 Visit: http://${host}:${port}`);
});

