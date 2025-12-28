"use client";
import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ItemTable from '../../components/ItemTable';
import ItemForm from '../../components/ItemForm';

export default function ItemsPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try {
      const res = await api.getItems(q, page, limit);
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load items');
    }
  }

  useEffect(() => { load(); }, [q, page, limit]);

  async function handleCreate(values: any) {
    await api.createItem(values);
    setShowForm(false);
    await load();
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <input className="bg-white border border-gray-300 p-2 rounded-md w-64 focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="bg-[#00B7B5] hover:bg-[#018790] text-white px-4 py-2 rounded-md font-medium" onClick={() => setShowForm(true)}>Add Item</button>
      </div>
      <ItemTable items={items} page={page} limit={limit} total={total} onPageChange={setPage} />
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm w-[560px] p-6">
            <h3 className="text-lg font-medium text-[#005461] mb-4">New Item</h3>
            <ItemForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
