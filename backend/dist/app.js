"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const items_1 = __importDefault(require("./routes/items"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = require("./utils/errorHandler");
const app = (0, express_1.default)();
const corsOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use((0, cors_1.default)({ origin: corsOrigin, credentials: false }));
app.use(express_1.default.json());
app.use('/api/items', items_1.default);
app.use('/api/auth', auth_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
