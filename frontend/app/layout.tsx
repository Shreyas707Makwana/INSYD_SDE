import '../styles/globals.css';
import React from 'react';
import HeaderAuth from '../components/HeaderAuth';

export const metadata = {
  title: 'Inventory Visibility',
  description: 'Inventory Visibility System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F4F4] text-[#005461]">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] pb-4">
            <h1 className="text-2xl font-semibold text-[#005461]">Inventory Visibility</h1>
            <HeaderAuth />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
