"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseClient_1 = require("../services/supabaseClient");
const router = (0, express_1.Router)();
router.post('/verify', async (req, res) => {
    var _a;
    const token = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token;
    if (!token)
        return res.status(400).json({ error: 'token is required' });
    const { user, error } = await (0, supabaseClient_1.verifyAccessToken)(token);
    if (error || !user)
        return res.status(401).json({ error: 'invalid token' });
    return res.json({ user });
});
exports.default = router;
