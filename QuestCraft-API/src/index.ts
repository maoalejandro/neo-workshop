import express from 'express';
import config from './config';
import questRoutes from './routes/quest.routes';
import { errorHandler } from './middleware/error-handler.middleware';

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// API Routes
app.use('/api', questRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the QuestCraft API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`QuestCraft API server running on port ${port}`);
});

export default app;