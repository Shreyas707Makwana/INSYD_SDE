"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, auth, supabase } from '../lib/api';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ totalSkus: number; totalQty: number }>({ totalSkus: 0, totalQty: 0 });
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function loadData() {
    try {
      const list = await api.getItems('', 1, 1000);
      const items = list.items || [];
      const totalQty = items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
      setStats({ totalSkus: items.length, totalQty });
      const ls = await api.getLowStock(5);
      setLowStock(ls.items || []);
      setDataError(null);
    } catch (e: any) {
      setDataError(e?.message || 'Failed to load');
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data?.session;
      if (!active) return;
      setIsAuthenticated(hasSession);
      if (hasSession) await loadData();
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      const authed = !!session;
      setIsAuthenticated(authed);
      if (authed) {
        await loadData();
      } else {
        setLowStock([]);
        setStats({ totalSkus: 0, totalQty: 0 });
        setDataError(null);
      }
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function submit() {
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Email and password are required');
      return;
    }
    try {
      if (isSignup) {
        const { error: signErr } = await supabase.auth.signUp({ email, password });
        if (signErr) {
          setAuthError(signErr.message);
          return;
        }
        const ok = await auth.signIn(email, password);
        if (!ok) {
          setAuthError('Sign-up succeeded. Please verify your email, then log in.');
          return;
        }
      } else {
        const ok = await auth.signIn(email, password);
        if (!ok) {
          setAuthError('Login failed');
          return;
        }
      }
      setIsAuthenticated(true);
      await loadData();
    } catch (e: any) {
      setAuthError(e?.message || 'Authentication error');
    }
  }

  return (
    <div>
      
      <div className="flex gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm">
          <div className="text-sm text-[#005461]/70">Total SKUs</div>
          <div className="text-3xl font-semibold text-[#005461]">{stats.totalSkus}</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm">
          <div className="text-sm text-[#005461]/70">Total Quantity</div>
          <div className="text-3xl font-semibold text-[#005461]">{stats.totalQty}</div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm">
          <Link className="text-[#00B7B5] hover:text-[#018790]" href="/items">Go to Inventory</Link>
        </div>
      </div>

      
      <h2 className="text-xl font-medium text-[#005461] mb-3">Low Stock</h2>
      {dataError && (
        <div className="text-[#B91C1C] mb-2">{isAuthenticated ? dataError : 'Please log in to view low stock.'}</div>
      )}
      <ul className="space-y-3 mb-8">
        {lowStock.map((it: any) => (
          <li key={it.id} className="p-3 bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm flex justify-between">
            <span className="text-[#005461]">{it.name} (SKU: {it.sku})</span>
            <span className="text-[#B45309]">Qty: {it.quantity}</span>
          </li>
        ))}
        {isAuthenticated && lowStock.length === 0 && (
          <li className="p-3 bg-white rounded-lg border border-[rgba(0,0,0,0.08)] text-[#005461]/70">No items at or below threshold.</li>
        )}
      </ul>

      
      {!isAuthenticated && (
        <div className="max-w-md bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#005461] mb-4">{isSignup ? 'Sign up' : 'Login'}</h2>
          <label className="block text-sm font-medium text-[#005461] mb-1">Email</label>
          <input
            className="bg-white border border-gray-300 p-2 rounded-md w-full mb-3 focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block text-sm font-medium text-[#005461] mb-1">Password</label>
          <input
            className="bg-white border border-gray-300 p-2 rounded-md w-full mb-4 focus:ring-1 focus:ring-[#00B7B5] focus:border-[#00B7B5] focus:outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-[#00B7B5] hover:bg-[#018790] text-white px-4 py-2 rounded-md font-medium" onClick={submit}>
            {isSignup ? 'Sign up' : 'Login'}
          </button>
          <div className="mt-3 text-sm">
            {isSignup ? (
              <button className="text-[#00B7B5] hover:text-[#018790]" onClick={() => setIsSignup(false)}>
                Already have an account? Log in
              </button>
            ) : (
              <button className="text-[#00B7B5] hover:text-[#018790]" onClick={() => setIsSignup(true)}>
                New user? Sign up
              </button>
            )}
          </div>
          {authError && <div className="text-[#B91C1C] mt-2">{authError}</div>}
        </div>
      )}
    </div>
  );
}
 
