"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const quest_routes_1 = __importDefault(require("./routes/quest.routes"));
const error_handler_middleware_1 = require("./middleware/error-handler.middleware");
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// API Routes
app.use('/api', quest_routes_1.default);
// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the QuestCraft API',
        version: '1.0.0'
    });
});
// Error handling middleware
app.use(error_handler_middleware_1.errorHandler);
// Start server
const port = config_1.default.port;
app.listen(port, () => {
    console.log(`QuestCraft API server running on port ${port}`);
});
exports.default = app;
