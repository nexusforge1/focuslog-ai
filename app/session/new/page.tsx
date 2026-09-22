"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Edit3, Target, CheckCircle2, HelpCircle, MessageSquare, ArrowRight, RotateCcw, Save, AlertCircle, Cpu, Layers, Code, Compass, Book, BookOpen } from 'lucide-react';
import { LearningPath, AISynthesisResult } from '@/.next/types/focuslog';
import { aiService } from '@/services/ai/provider';
import { storageService } from '@/services/storage/storage';

export default function NewSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPath = (searchParams.get('path') as LearningPath) || 'System Design';

  const [activePath, setActivePath] = useState<LearningPath>(initialPath);
  const [rawThoughts, setRawThoughts] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const [editableSynthesis, setEditableSynthesis] = useState<AISynthesisResult>({
    core_learning: '',
    understanding: '',
    friction: '',
    articulation_drill: '',
    next_step: ''
  });
  const [hasSynthesized, setHasSynthesized] = useState(false);

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

  const handleSynthesize = async () => {
    if (!rawThoughts.trim()) return;
    setIsSynthesizing(true);
    setSynthesisError(null);
    try {
      const result = await aiService.synthesizeSession(activePath, rawThoughts);
      setEditableSynthesis(result);
      setHasSynthesized(true);
    } catch (err: any) {
      setSynthesisError(err.message || "Failed to connect to synthesis service.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveSession = () => {
    if (!rawThoughts.trim()) return;
    const newSession = storageService.saveSession({
      path: activePath,
      raw_thoughts: rawThoughts,
      core_learning: editableSynthesis.core_learning || 'No core learning noted.',
      understanding: editableSynthesis.understanding || 'General understanding.',
      friction: editableSynthesis.friction || 'No friction noted.',
      articulation_drill: editableSynthesis.articulation_drill || 'Reflect on your notes.',
      next_step: editableSynthesis.next_step || 'Review key concepts.'
    });

    router.push(`/archive/${newSession.id}`);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">Select Learning Path</label>
        <div className="flex flex-wrap gap-2">
          {learningPaths.map(path => (
            <button
              key={path}
              onClick={() => setActivePath(path)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 border cursor-pointer ${activePath === path ? 'bg-stone-900 text-white border-stone-900 shadow-xs' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
            >
              {getPathIcon(path)}
              <span>{path}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone-900 flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-stone-500" />
            <span>What did you learn / think about today?</span>
          </label>
          <span className="text-xs text-stone-400">Freewrite without structure</span>
        </div>
        <textarea
          value={rawThoughts}
          onChange={(e) => setRawThoughts(e.target.value)}
          placeholder="Today I was learning about... I understand that... but I am still confused about..."
          rows={8}
          className="w-full p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-400/50 focus:bg-white transition-all resize-y leading-relaxed placeholder:text-stone-400"
        />
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing || !rawThoughts.trim()}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-sm font-medium transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSynthesizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing Session...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Synthesize My Session</span>
              </>
            )}
          </button>
        </div>
        {synthesisError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{synthesisError}</span>
          </div>
        )}
      </div>

      {hasSynthesized && (
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">AI Reflection & Coaching</h3>
              <p className="text-xs text-stone-500">Edit any section below before saving into your archive.</p>
            </div>
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-synthesize</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center space-x-2">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Core Learning</span>
              </label>
              <textarea
                value={editableSynthesis.core_learning}
                onChange={(e) => setEditableSynthesis({...editableSynthesis, core_learning: e.target.value})}
                rows={2}
                className="w-full p-3 rounded-lg border border-stone-200/80 bg-stone-50/50 text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 transition-all resize-y"
              />
            </div>

            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>What I Understand</span>
              </label>
              <textarea
                value={editableSynthesis.understanding}
                onChange={(e) => setEditableSynthesis({...editableSynthesis, understanding: e.target.value})}
                rows={2}
                className="w-full p-3 rounded-lg border border-stone-200/80 bg-stone-50/50 text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 transition-all resize-y"
              />
            </div>

            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Friction / Confusion</span>
              </label>
              <textarea
                value={editableSynthesis.friction}
                onChange={(e) => setEditableSynthesis({...editableSynthesis, friction: e.target.value})}
                rows={2}
                className="w-full p-3 rounded-lg border border-stone-200/80 bg-stone-50/50 text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 transition-all resize-y"
              />
            </div>

            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xs space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Articulation Drill (Explain in your own words)</span>
              </label>
              <textarea
                value={editableSynthesis.articulation_drill}
                onChange={(e) => setEditableSynthesis({...editableSynthesis, articulation_drill: e.target.value})}
                rows={2}
                className="w-full p-3 rounded-lg border border-stone-700 bg-stone-800 text-sm text-white focus:bg-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-400 transition-all resize-y"
              />
            </div>

            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                <span>Next Concrete Step</span>
              </label>
              <textarea
                value={editableSynthesis.next_step}
                onChange={(e) => setEditableSynthesis({...editableSynthesis, next_step: e.target.value})}
                rows={2}
                className="w-full p-3 rounded-lg border border-stone-200/80 bg-stone-50/50 text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 transition-all resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <button
              onClick={handleSaveSession}
              className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Session to Archive</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}