"use client";
import React, { useEffect, useState } from 'react';
import { supabase, auth } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function HeaderAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (active) setIsAuthed(!!data?.session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setIsAuthed(!!session);
    });
    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function handleLogout() {
    await auth.signOut();
    setIsAuthed(false);
    router.replace('/');
  }

  return (
    <div className="flex items-center gap-3">
      {isAuthed && (
        <button
          className="px-3 py-1.5 rounded-md bg-transparent border border-[#00B7B5] text-[#00B7B5] hover:bg-[#00B7B5] hover:text-white font-medium"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
}
