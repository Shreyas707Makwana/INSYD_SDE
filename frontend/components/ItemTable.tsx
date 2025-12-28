"use client";
import React from 'react';
import Link from 'next/link';

export default function ItemTable({ items, page, limit, total, onPageChange }: any) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));
  return (
    <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-[rgba(0,0,0,0.08)] bg-[#E6F7F7]">
            <th className="p-3 text-sm text-[#005461]">SKU</th>
            <th className="p-3 text-sm text-[#005461]">Name</th>
            <th className="p-3 text-sm text-[#005461]">Category</th>
            <th className="p-3 text-sm text-[#005461]">Qty</th>
            <th className="p-3 text-sm text-[#005461]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it: any) => (
            <tr key={it.id} className="border-b border-[rgba(0,0,0,0.08)] hover:bg-[#F4F4F4]">
              <td className="p-3 text-[#005461]">{it.sku}</td>
              <td className="p-3 text-[#005461]">{it.name}</td>
              <td className="p-3 text-[#005461]">{it.category}</td>
              <td className={`p-3 ${it?.low_stock_threshold != null && it?.quantity <= it?.low_stock_threshold ? 'text-[#B45309] font-medium' : 'text-[#005461]'}`}>{it.quantity}</td>
              <td className="p-3">
                <Link className="text-[#00B7B5] hover:text-[#018790]" href={`/items/${it.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td className="p-3 text-[#475569]" colSpan={5}>No items found.</td></tr>
          )}
        </tbody>
      </table>
      <div className="p-3 flex gap-3 justify-end">
        <button className="px-3 py-1.5 rounded-md bg-transparent border border-[#00B7B5] text-[#00B7B5] hover:bg-[#00B7B5] hover:text-white" onClick={() => onPageChange(Math.max(1, page-1))} disabled={page<=1}>Prev</button>
        <span className="text-sm text-[#005461]/70">Page {page} / {totalPages}</span>
        <button className="px-3 py-1.5 rounded-md bg-transparent border border-[#00B7B5] text-[#00B7B5] hover:bg-[#00B7B5] hover:text-white" onClick={() => onPageChange(Math.min(totalPages, page+1))} disabled={page>=totalPages}>Next</button>
      </div>
    </div>
  );
}
