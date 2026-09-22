"use client";

import { FocusSession } from '@/.next/types/focuslog';

const STORAGE_KEY = 'focuslog_sessions_v1';

const defaultSessions: FocusSession[] = [
  {
    id: 's-1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    path: 'System Design',
    raw_thoughts: 'Today I was learning about database indexes. I understand that indexes make reads faster but I am still confused about when indexes actually hurt performance. I also watched something about B-trees but I do not think I really understand why B-trees are used instead of hash maps for range queries...',
    core_learning: 'Explored database B-Tree index mechanics and the read vs. write amplification tradeoff.',
    understanding: 'Clear grasp that B-Trees maintain sorted order enabling efficient range scans, unlike standard hash maps which excel only at point lookups.',
    friction: 'Unclear on exact write overhead calculation (page splits, random disk I/O, and WAL logging impact on insert throughput).',
    articulation_drill: 'Explain why a B-Tree index accelerates range queries while a Hash Index struggles with them, using an analogy.',
    next_step: 'Benchmark an insert-heavy workload with vs. without an index on a local Postgres or SQLite instance.'
  },
  {
    id: 's-2',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    path: 'AI',
    raw_thoughts: 'Experimented with system instructions and JSON structured outputs in LLMs. Noticed that temperature affects creativity but sometimes causes hallucination if set too high. Tried to understand how schema validation forces compliance.',
    core_learning: 'Tested deterministic JSON mode constraints and temperature tuning parameters.',
    understanding: 'Understands that low temperature reduces randomness and schema constraints enforce token-level syntax matching.',
    friction: 'Confused about how grammar-based sampling masks logits under the hood without hurting overall model fluency.',
    articulation_drill: 'Describe the difference between adjusting temperature and applying a strict JSON response schema.',
    next_step: 'Write a small test script validating structured output failure rates across 10 trials.'
  }
];

export const storageService = {
  getSessions(): FocusSession[] {
    if (typeof window === 'undefined') return defaultSessions;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSessions));
        return defaultSessions;
      }
      return JSON.parse(data);
    } catch (e) {
      return defaultSessions;
    }
  },

  getSessionById(id: string): FocusSession | null {
    const sessions = this.getSessions();
    return sessions.find((s) => s.id === id) || null;
  },

  saveSession(sessionData: Omit<FocusSession, 'id' | 'created_at'>): FocusSession {
    const sessions = this.getSessions();
    const newSession: FocusSession = {
      ...sessionData,
      id: 'session-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    const updated = [newSession, ...sessions];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newSession;
  },

  deleteSession(id: string): FocusSession[] {
    const sessions = this.getSessions();
    const updated = sessions.filter((s) => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }
};