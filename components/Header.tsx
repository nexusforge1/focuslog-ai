"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Clock, Key } from 'lucide-react';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function Header() {
  const pathname = usePathname();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-semibold tracking-tight shadow-xs">
            FL
          </div>
          <div>
            <h1 className="font-medium text-base tracking-tight text-stone-900">FocusLog AI</h1>
            <p className="text-xs text-stone-500">Personal Learning & Thinking System</p>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link 
            href="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${pathname === '/' ? 'bg-stone-200/70 text-stone-900' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link 
            href="/session"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${pathname === '/session' ? 'bg-stone-200/70 text-stone-900' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Session</span>
          </Link>
          <Link 
            href="/archive"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${pathname.startsWith('/archive') ? 'bg-stone-200/70 text-stone-900' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Archive</span>
          </Link>

          <div className="h-5 w-[1px] bg-stone-200 mx-1" />

          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            title="Configure Gemini API Key"
            className="p-2.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Key className="w-4 h-4 text-stone-500" />
            <span className="hidden md:inline text-xs font-medium">API Key</span>
          </button>
        </nav>
      </header>

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
    </>
  );
}