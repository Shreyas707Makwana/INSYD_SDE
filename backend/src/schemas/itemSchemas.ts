import { z } from 'zod';

export const itemCreateSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  quantity: z.number().int().nonnegative().optional(),
  low_stock_threshold: z.number().int().nonnegative().optional(),
});

export const itemUpdateSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  quantity: z.number().int().nonnegative().optional(),
  low_stock_threshold: z.number().int().nonnegative().optional(),
});

export const stockChangeSchema = z.object({
  amount: z.number().int().positive(),
  note: z.string().optional(),
});

export type Item = {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  quantity: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  item_id: string;
  type: 'in' | 'out';
  amount: number;
  note: string | null;
  created_at: string;
};
