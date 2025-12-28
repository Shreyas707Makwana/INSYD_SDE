"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const supabaseClient_1 = require("../services/supabaseClient");
async function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) {
        return res.status(401).json({ error: 'Missing bearer token' });
    }
    const { user, error } = await (0, supabaseClient_1.verifyAccessToken)(token);
    if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
}
