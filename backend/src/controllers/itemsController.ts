import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { itemCreateSchema, itemUpdateSchema, stockChangeSchema } from '../schemas/itemSchemas';

function isLowStock(quantity: number, threshold: number | null): boolean {
  const t = typeof threshold === 'number' ? threshold : 5;
  return quantity <= t;
}

export async function createItem(req: Request, res: Response) {
  const parse = itemCreateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const body = parse.data;

  const { data, error } = await supabase
    .from('items')
    .insert({
      sku: body.sku,
      name: body.name,
      category: body.category ?? null,
      quantity: body.quantity ?? 0,
      low_stock_threshold: body.low_stock_threshold ?? 5,
    })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
}

export async function listItems(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const offset = (page - 1) * limit;

  let query = supabase.from('items').select('*', { count: 'exact' });
  if (q) {
    query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%,category.ilike.%${q}%`);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ items: data || [], total: count || 0 });
}

export async function getItem(req: Request, res: Response) {
  const id = req.params.id;
  const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Item not found' });
  return res.json(data);
}

export async function updateItem(req: Request, res: Response) {
  const id = req.params.id;
  const parse = itemUpdateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const body = parse.data;

  const { data, error } = await supabase
    .from('items')
    .update({
      ...('sku' in body ? { sku: body.sku } : {}),
      ...('name' in body ? { name: body.name } : {}),
      ...('category' in body ? { category: body.category ?? null } : {}),
      ...('quantity' in body ? { quantity: body.quantity } : {}),
      ...('low_stock_threshold' in body ? { low_stock_threshold: body.low_stock_threshold } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
}

export async function deleteItem(req: Request, res: Response) {
  const id = req.params.id;
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
}

export async function stockIn(req: Request, res: Response) {
  const id = req.params.id;
  const parse = stockChangeSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { amount, note } = parse.data;

  const { data: txId, error: rpcError } = await supabase.rpc('fn_stock_in', {
    p_item_id: id,
    p_amount: amount,
    p_note: note ?? null,
  });
  if (rpcError) return res.status(400).json({ error: rpcError.message });

  const { data: item, error: itemErr } = await supabase.from('items').select('*').eq('id', id).single();
  if (itemErr) return res.status(400).json({ error: itemErr.message });
  return res.json({ item, transactionId: txId });
}

export async function stockOut(req: Request, res: Response) {
  const id = req.params.id;
  const parse = stockChangeSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { amount, note } = parse.data;

  const { data: txId, error: rpcError } = await supabase.rpc('fn_stock_out', {
    p_item_id: id,
    p_amount: amount,
    p_note: note ?? null,
  });
  if (rpcError) {
    const msg = rpcError.message.includes('insufficient_stock')
      ? 'Insufficient stock'
      : rpcError.message;
    return res.status(400).json({ error: msg });
  }

  const { data: item, error: itemErr } = await supabase.from('items').select('*').eq('id', id).single();
  if (itemErr) return res.status(400).json({ error: itemErr.message });
  return res.json({ item, transactionId: txId });
}

export async function lowStock(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('items')
    .select('*');
  if (error) return res.status(400).json({ error: error.message });
  const items = (data || []).filter((it: any) => {
    const t = typeof it.low_stock_threshold === 'number' ? it.low_stock_threshold : 5;
    return (it.quantity ?? 0) <= t;
  });
  return res.json({ items });
}

export function applyStockOut(current: number, amount: number) {
  if (amount <= 0) throw new Error('amount must be > 0');
  if (current - amount < 0) throw new Error('Insufficient stock');
  return current - amount;
}
