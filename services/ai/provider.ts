import { AISynthesisResult, LearningPath } from '@/types/focuslog';

export interface AIProvider {
  synthesizeSession(path: LearningPath, rawThoughts: string): Promise<AISynthesisResult>;
}

class GeminiAIProvider implements AIProvider {
  async synthesizeSession(path: LearningPath, rawThoughts: string): Promise<AISynthesisResult> {
    const response = await fetch('/api/ai/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','x-gemini-api-key': localStorage.getItem('focuslog_user_gemini_api_key') || '' },
      body: JSON.stringify({ path, rawThoughts }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to synthesize session');
    }

    return await response.json();
  }
}

export const aiService = new GeminiAIProvider();