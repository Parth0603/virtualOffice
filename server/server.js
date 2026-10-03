import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSocketServer } from './socket/connection.js';
import { workspaceManager } from './state/WorkspaceManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

setupSocketServer(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Check if a workspace exists
app.get('/api/workspace/:id', (req, res) => {
  const { id } = req.params;
  const workspace = workspaceManager.getWorkspace(id);
  if (!workspace) {
    return res.status(404).json({ exists: false, message: 'Workspace does not exist' });
  }
  return res.json({ exists: true, id, playerCount: workspace.getPlayerCount() });
});

// Serve frontend dist if it exists
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Virtual Workspace Backend Server Running.');
    }
  });
});

const PORT = process.env.PORT || 4002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Virtual Workspace server running on port ${PORT}`);
});
