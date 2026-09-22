"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Layers, Cpu, Code, Compass, Book, BookOpen, ChevronRight } from 'lucide-react';
import { FocusSession, LearningPath } from '@/types/focuslog';
import { storageService } from '@/services/storage/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    setSessions(storageService.getSessions());
  }, []);

  const learningPaths: LearningPath[] = ['AI', 'System Design', 'Full Stack', 'Domain', 'English'];

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

  return (
    <div className="space-y-12">
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Calm Focus Active</span>
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">What are you exploring today?</h2>
          <p className="text-stone-500 text-sm max-w-lg leading-relaxed">
            Turn messy learning sessions into structured understanding, articulate your friction points, and identify your next step.
          </p>
        </div>
        <Link
          href="/session"
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-all shadow-xs flex items-center space-x-2 group whitespace-nowrap"
        >
          <span>Start New Session</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 px-1">Active Learning Paths</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {learningPaths.map(path => (
            <button
              key={path}
              onClick={() => router.push(`/session?path=${encodeURIComponent(path)}`)}
              className="p-4 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-xl text-left transition-all group shadow-2xs flex flex-col justify-between h-28 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-stone-200/80 transition-colors">
                {getPathIcon(path)}
              </div>
              <div>
                <span className="text-xs text-stone-400 block font-medium">Path</span>
                <span className="text-sm font-semibold text-stone-900 group-hover:text-stone-700">{path}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Recent Sessions</h3>
          <Link href="/archive" className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center space-x-1">
            <span>View all archive</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400">
            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No learning sessions recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sessions.slice(0, 3).map(session => (
              <Link 
                key={session.id}
                href={`/archive/${session.id}`}
                className="bg-white hover:border-stone-300 border border-stone-200/90 rounded-2xl p-6 transition-all shadow-2xs group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {getPathIcon(session.path)}
                      <span>{session.path}</span>
                    </span>
                    <span className="text-xs text-stone-400">
                      {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-stone-700">
                    {session.core_learning}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {session.raw_thoughts}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-stone-400 group-hover:text-stone-900 transition-colors">
                  <span>Review</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}