"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, PlusCircle, ChevronRight, ArrowRight, FileText, Cpu, Layers, Code, Compass, Book, BookOpen } from 'lucide-react';
import { FocusSession, LearningPath } from '@/types/focuslog';
import { storageService } from '@/services/storage/storage';

export default function ArchivePage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [archiveFilter, setArchiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSessions = sessions.filter(session => {
    const matchesPath = archiveFilter === 'All' || session.path === archiveFilter;
    const matchesSearch = searchQuery === '' || 
      session.raw_thoughts.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.core_learning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.next_step.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPath && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Session Archive</h2>
          <p className="text-stone-500 text-sm">Review your past reflections, raw thoughts, and learning progressions.</p>
        </div>
        <Link
          href="/session"
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-all shadow-xs flex items-center space-x-2"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Session</span>
        </Link>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search across saved sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', ...learningPaths].map(path => (
            <button
              key={path}
              onClick={() => setArchiveFilter(path)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${archiveFilter === path ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'}`}
            >
              {path}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredSessions.map(session => (
          <Link
            key={session.id}
            href={`/archive/${session.id}`}
            className="block bg-white hover:border-stone-300 border border-stone-200/90 rounded-2xl p-6 transition-all shadow-2xs group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {getPathIcon(session.path)}
                  <span>{session.path}</span>
                </span>
                <span className="text-xs text-stone-400">
                  {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <span className="text-xs font-medium text-stone-400 group-hover:text-stone-900 transition-colors flex items-center space-x-1">
                <span>Open Session</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-stone-900">
                {session.core_learning}
              </p>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {session.raw_thoughts}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium text-stone-700 flex items-center space-x-1">
                <ArrowRight className="w-3 h-3 text-purple-600" />
                <span>Next Step: {session.next_step}</span>
              </span>
            </div>
          </Link>
        ))}

        {filteredSessions.length === 0 && (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No matching sessions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}