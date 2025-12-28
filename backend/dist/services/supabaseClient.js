"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.verifyAccessToken = verifyAccessToken;
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});
async function verifyAccessToken(accessToken) {
    const { data, error } = await exports.supabase.auth.getUser(accessToken);
    if (error)
        return { user: null, error };
    return { user: (data === null || data === void 0 ? void 0 : data.user) || null, error: null };
}
