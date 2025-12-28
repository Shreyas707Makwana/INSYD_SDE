"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [item, setItem] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [amount, setAmount] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const it = await api.getItem(id);
      setItem(it);
      setForm({
        sku: it.sku,
        name: it.name,
        category: it.category || '',
        quantity: it.quantity,
        low_stock_threshold: it.low_stock_threshold,
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to load item');
    }
  }

  useEffect(() => { if (id) load(); }, [id]);

  async function save() {
    await api.updateItem(id, form);
    await load();
  }
  async function del() {
    await api.deleteItem(id);
    router.push('/items');
  }
  async function doIn() {
    await api.stockIn(id, amount, note);
    setAmount(1); setNote('');
    await load();
  }
  async function doOut() {
    const res = await api.stockOut(id, amount, note);
    if (res?.error) setError(res.error);
    setAmount(1); setNote('');
    await load();
  }

  if (!item) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm p-6">
        <h2 className="text-xl font-semibold text-[#005461] mb-4">Edit Item</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="edit-sku" className="block text-sm font-medium text-[#005461] mb-1">SKU</label>
            <input id="edit-sku" className="border border-[#E2E8F0] p-2 rounded-md w-full focus:ring-1 focus:ring-[#2563EB] focus:outline-none" value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} />
          </div>
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-[#005461] mb-1">Name</label>
            <input id="edit-name" className="border border-[#E2E8F0] p-2 rounded-md w-full focus:ring-1 focus:ring-[#2563EB] focus:outline-none" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-[#005461] mb-1">Category</label>
            <input id="edit-category" className="border border-[#E2E8F0] p-2 rounded-md w-full focus:ring-1 focus:ring-[#2563EB] focus:outline-none" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
          </div>
          <div>
            <label htmlFor="edit-quantity" className="block text-sm font-medium text-[#005461] mb-1">Quantity</label>
            <input id="edit-quantity" className="border border-[#E2E8F0] p-2 rounded-md w-full focus:ring-1 focus:ring-[#2563EB] focus:outline-none" type="number" value={form.quantity} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="edit-threshold" className="block text-sm font-medium text-[#005461] mb-1">Low Stock Threshold</label>
            <input id="edit-threshold" className="border border-[#E2E8F0] p-2 rounded-md w-full focus:ring-1 focus:ring-[#2563EB] focus:outline-none" type="number" value={form.low_stock_threshold} onChange={e=>setForm({...form, low_stock_threshold: Number(e.target.value)})} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="bg-[#00B7B5] hover:bg-[#018790] text-white px-4 py-2 rounded-md font-medium" onClick={save}>Save</button>
          <button className="bg-[#B91C1C] hover:brightness-95 text-white px-4 py-2 rounded-md" onClick={del}>Delete</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm p-6">
        <h3 className="text-lg font-medium text-[#005461] mb-4">Stock Actions</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="stock-amount" className="block text-sm font-medium text-[#005461] mb-1">Amount</label>
            <input id="stock-amount" className="border border-[#E2E8F0] p-2 rounded-md w-24 focus:ring-1 focus:ring-[#2563EB] focus:outline-none" type="number" min={1} value={amount} onChange={e=>setAmount(Number(e.target.value))} />
          </div>
          <div>
            <label htmlFor="stock-note" className="block text-sm font-medium text-[#005461] mb-1">Note (optional)</label>
            <input id="stock-note" className="border border-[#E2E8F0] p-2 rounded-md w-full focus:ring-1 focus:ring-[#2563EB] focus:outline-none" value={note} onChange={e=>setNote(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="bg-[#00B7B5] hover:bg-[#018790] text-white px-4 py-2 rounded-md font-medium" onClick={doIn}>Stock In</button>
          <button className="px-4 py-2 rounded-md bg-transparent border border-[#00B7B5] text-[#00B7B5] hover:bg-[#00B7B5] hover:text-white font-medium" onClick={doOut}>Stock Out</button>
        </div>
        {error && <div className="text-[#B91C1C] mt-2">{error}</div>}
      </div>
    </div>
  );
}
