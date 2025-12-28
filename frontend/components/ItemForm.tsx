"use client";
import React, { useState } from 'react';

export default function ItemForm({ onSubmit, onCancel }: any) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [low_stock_threshold, setThreshold] = useState(5);

  function submit() {
    onSubmit({ sku, name, category, quantity, low_stock_threshold });
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-[#005461] mb-1">SKU</label>
        <input id="sku" className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none" value={sku} onChange={e=>setSku(e.target.value)} />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#005461] mb-1">Name</label>
        <input id="name" className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[#005461] mb-1">Category</label>
        <input id="category" className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none" value={category} onChange={e=>setCategory(e.target.value)} />
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-[#005461] mb-1">Quantity</label>
        <input id="quantity" className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none" type="number" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} />
      </div>
      <div>
        <label htmlFor="threshold" className="block text-sm font-medium text-[#005461] mb-1">Low Stock Threshold</label>
        <input id="threshold" className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none" type="number" value={low_stock_threshold} onChange={e=>setThreshold(Number(e.target.value))} />
      </div>
      <div className="flex gap-3">
        <button className="bg-[#00B7B5] hover:bg-[#018790] text-white px-4 py-2 rounded-md font-medium" onClick={submit}>Create</button>
        <button className="px-4 py-2 rounded-md bg-transparent border border-[#00B7B5] text-[#00B7B5] hover:bg-[#00B7B5] hover:text-white" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
