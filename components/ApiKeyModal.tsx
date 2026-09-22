"use client";

import React, { useState, useEffect } from 'react';
import { Key, Check, Trash2, X } from 'lucide-react';
import { apiKeyService } from '@/services/storage/apiKey';

export default function ApiKeyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(apiKeyService.getKey() || '');
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      apiKeyService.setKey(keyInput);
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 600);
    }
  };

  const handleRemove = () => {
    apiKeyService.clearKey();
    setKeyInput('');
    setSaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-stone-700" />
            <h3 className="font-semibold text-stone-900">Gemini API Key Settings</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          FocusLog AI runs on your personal browser context. Your API key is stored securely in your browser's <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">localStorage</code> and is never saved on our servers or Vercel logs.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">Custom Gemini API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {apiKeyService.getKey() ? (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50/50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Key</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                <span>{saved ? 'Saved!' : 'Save Key'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}