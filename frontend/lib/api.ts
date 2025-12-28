import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true },
});

let accessToken: string | null = null;

async function ensureAccessToken() {
  if (accessToken) return accessToken;
  const { data } = await supabase.auth.getSession();
  accessToken = data?.session?.access_token || null;
  return accessToken;
}

supabase.auth.onAuthStateChange((_event, session) => {
  accessToken = session?.access_token || null;
});

export const auth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    accessToken = data.session?.access_token || null;
    return !!accessToken;
  },
  async signOut() {
    await supabase.auth.signOut();
    accessToken = null;
    return true;
  },
};

async function fetchJSON(path: string, init?: RequestInit) {
  const token = await ensureAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BACKEND_URL}${path}`, { ...init, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
  return json;
}

export const api = {
  async getItems(q = '', page = 1, limit = 10) {
    const params = new URLSearchParams({ q, page: String(page), limit: String(limit) });
    return await fetchJSON(`/api/items?${params.toString()}`);
  },
  async getItem(id: string) {
    return await fetchJSON(`/api/items/${id}`);
  },
  async createItem(body: any) {
    return await fetchJSON('/api/items', { method: 'POST', body: JSON.stringify(body) });
  },
  async updateItem(id: string, body: any) {
    return await fetchJSON(`/api/items/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  async deleteItem(id: string) {
    const token = await ensureAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BACKEND_URL}/api/items/${id}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('Failed to delete');
  },
  async stockIn(id: string, amount: number, note?: string) {
    return await fetchJSON(`/api/items/${id}/stock-in`, { method: 'POST', body: JSON.stringify({ amount, note }) });
  },
  async stockOut(id: string, amount: number, note?: string) {
    try {
      return await fetchJSON(`/api/items/${id}/stock-out`, { method: 'POST', body: JSON.stringify({ amount, note }) });
    } catch (e: any) {
      return { error: e?.message || 'Stock-out failed' };
    }
  },
  async getLowStock(threshold = 5) {
    const params = new URLSearchParams({ threshold: String(threshold) });
    return await fetchJSON(`/api/items/low-stock?${params.toString()}`);
  },
};
