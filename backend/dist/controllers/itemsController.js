"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = createItem;
exports.listItems = listItems;
exports.getItem = getItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.stockIn = stockIn;
exports.stockOut = stockOut;
exports.lowStock = lowStock;
exports.applyStockOut = applyStockOut;
const supabaseClient_1 = require("../services/supabaseClient");
const itemSchemas_1 = require("../schemas/itemSchemas");
function isLowStock(quantity, threshold) {
    const t = typeof threshold === 'number' ? threshold : 5;
    return quantity <= t;
}
async function createItem(req, res) {
    var _a, _b, _c;
    const parse = itemSchemas_1.itemCreateSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const body = parse.data;
    const { data, error } = await supabaseClient_1.supabase
        .from('items')
        .insert({
        sku: body.sku,
        name: body.name,
        category: (_a = body.category) !== null && _a !== void 0 ? _a : null,
        quantity: (_b = body.quantity) !== null && _b !== void 0 ? _b : 0,
        low_stock_threshold: (_c = body.low_stock_threshold) !== null && _c !== void 0 ? _c : 5,
    })
        .select('*')
        .single();
    if (error)
        return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
}
async function listItems(req, res) {
    const q = req.query.q || '';
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;
    let query = supabaseClient_1.supabase.from('items').select('*', { count: 'exact' });
    if (q) {
        query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%,category.ilike.%${q}%`);
    }
    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error)
        return res.status(400).json({ error: error.message });
    return res.json({ items: data || [], total: count || 0 });
}
async function getItem(req, res) {
    const id = req.params.id;
    const { data, error } = await supabaseClient_1.supabase.from('items').select('*').eq('id', id).single();
    if (error)
        return res.status(404).json({ error: 'Item not found' });
    return res.json(data);
}
async function updateItem(req, res) {
    var _a;
    const id = req.params.id;
    const parse = itemSchemas_1.itemUpdateSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const body = parse.data;
    const { data, error } = await supabaseClient_1.supabase
        .from('items')
        .update({
        ...('sku' in body ? { sku: body.sku } : {}),
        ...('name' in body ? { name: body.name } : {}),
        ...('category' in body ? { category: (_a = body.category) !== null && _a !== void 0 ? _a : null } : {}),
        ...('quantity' in body ? { quantity: body.quantity } : {}),
        ...('low_stock_threshold' in body ? { low_stock_threshold: body.low_stock_threshold } : {}),
        updated_at: new Date().toISOString(),
    })
        .eq('id', id)
        .select('*')
        .single();
    if (error)
        return res.status(400).json({ error: error.message });
    return res.json(data);
}
async function deleteItem(req, res) {
    const id = req.params.id;
    const { error } = await supabaseClient_1.supabase.from('items').delete().eq('id', id);
    if (error)
        return res.status(400).json({ error: error.message });
    return res.status(204).send();
}
async function stockIn(req, res) {
    const id = req.params.id;
    const parse = itemSchemas_1.stockChangeSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { amount, note } = parse.data;
    const { data: txId, error: rpcError } = await supabaseClient_1.supabase.rpc('fn_stock_in', {
        p_item_id: id,
        p_amount: amount,
        p_note: note !== null && note !== void 0 ? note : null,
    });
    if (rpcError)
        return res.status(400).json({ error: rpcError.message });
    const { data: item, error: itemErr } = await supabaseClient_1.supabase.from('items').select('*').eq('id', id).single();
    if (itemErr)
        return res.status(400).json({ error: itemErr.message });
    return res.json({ item, transactionId: txId });
}
async function stockOut(req, res) {
    const id = req.params.id;
    const parse = itemSchemas_1.stockChangeSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { amount, note } = parse.data;
    const { data: txId, error: rpcError } = await supabaseClient_1.supabase.rpc('fn_stock_out', {
        p_item_id: id,
        p_amount: amount,
        p_note: note !== null && note !== void 0 ? note : null,
    });
    if (rpcError) {
        const msg = rpcError.message.includes('insufficient_stock')
            ? 'Insufficient stock'
            : rpcError.message;
        return res.status(400).json({ error: msg });
    }
    const { data: item, error: itemErr } = await supabaseClient_1.supabase.from('items').select('*').eq('id', id).single();
    if (itemErr)
        return res.status(400).json({ error: itemErr.message });
    return res.json({ item, transactionId: txId });
}
async function lowStock(req, res) {
    const { data, error } = await supabaseClient_1.supabase
        .from('items')
        .select('*');
    if (error)
        return res.status(400).json({ error: error.message });
    const items = (data || []).filter((it) => {
        var _a;
        const t = typeof it.low_stock_threshold === 'number' ? it.low_stock_threshold : 5;
        return ((_a = it.quantity) !== null && _a !== void 0 ? _a : 0) <= t;
    });
    return res.json({ items });
}
function applyStockOut(current, amount) {
    if (amount <= 0)
        throw new Error('amount must be > 0');
    if (current - amount < 0)
        throw new Error('Insufficient stock');
    return current - amount;
}
