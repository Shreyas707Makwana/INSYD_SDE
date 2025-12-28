// Jest tests for core stock logic
import { applyStockOut } from '../controllers/itemsController';

describe('stock logic', () => {
  it('stock-out reduces quantity when sufficient', () => {
    expect(applyStockOut(10, 3)).toBe(7);
  });
  it('stock-out fails when amount > quantity', () => {
    expect(() => applyStockOut(2, 3)).toThrow('Insufficient stock');
  });
  it('stock-out fails when amount <= 0', () => {
    expect(() => applyStockOut(5, 0)).toThrow('amount must be > 0');
  });
});
