"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockChangeSchema = exports.itemUpdateSchema = exports.itemCreateSchema = void 0;
const zod_1 = require("zod");
exports.itemCreateSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().optional(),
    quantity: zod_1.z.number().int().nonnegative().optional(),
    low_stock_threshold: zod_1.z.number().int().nonnegative().optional(),
});
exports.itemUpdateSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1).optional(),
    name: zod_1.z.string().min(1).optional(),
    category: zod_1.z.string().optional(),
    quantity: zod_1.z.number().int().nonnegative().optional(),
    low_stock_threshold: zod_1.z.number().int().nonnegative().optional(),
});
exports.stockChangeSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive(),
    note: zod_1.z.string().optional(),
});
