"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Trash2, Cpu, Layers, Code, Compass, Book, BookOpen } from 'lucide-react';
import { FocusSession, LearningPath } from '@/.next/types/focuslog';
import { storageService } from '@/services/storage/storage';

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [session, setSession] = useState<FocusSession | null>(null);

  useEffect(() => {
    if (id) {
      const found = storageService.getSessionById(id);
      setSession(found);
    }
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    storageService.deleteSession(id);
    router.push('/archive');
  };

  const getPathIcon = (path: LearningPath) => {
    switch(path) {
      case 'AI': return <Cpu className="w-4 h-4 text-purple-500" />;
      case 'System Design': return <Layers className="w-4 h-4 text-blue-500" />;
      case 'Full Stack': return <Code className="w-4 h-4 text-emerald-500" />;
      case 'Domain': return <Compass className="w-4 h-4 text-amber-500" />;
      case 'English': return <Book className="w-4 h-4 text-rose-500" />;
      default: return <BookOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!session) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p className="text-sm">Session not found.</p>
        <Link href="/archive" className="text-xs text-stone-900 underline mt-2 block">
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/archive"
          className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-all"
        >
          <span>← Back to Archive</span>
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Session</span>
        </button>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
            {getPathIcon(session.path)}
            <span>{session.path}</span>
          </span>
          <span className="text-xs text-stone-400">
            Recorded on {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-sm text-stone-800 leading-relaxed italic">
          "{session.raw_thoughts}"
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-1">Synthesis & Reflection</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Core Learning</label>
            <p className="text-sm font-semibold text-stone-900">{session.core_learning}</p>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">What I Understand</label>
            <p className="text-sm text-stone-800 leading-relaxed">{session.understanding}</p>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Friction / Confusion</label>
            <p className="text-sm text-stone-800 leading-relaxed">{session.friction}</p>
          </div>

          <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xs space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">Articulation Drill</label>
            <p className="text-sm text-white leading-relaxed">{session.articulation_drill}</p>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Next Concrete Step</label>
            <p className="text-sm font-semibold text-purple-700">{session.next_step}</p>
          </div>
        </div>
      </div>
    </div>
  );
}