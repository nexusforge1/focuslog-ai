export type LearningPath = 'AI' | 'System Design' | 'Full Stack' | 'Domain' | 'English';

export interface AISynthesisResult {
  core_learning: string;
  understanding: string;
  friction: string;
  articulation_drill: string;
  next_step: string;
}

export interface FocusSession extends AISynthesisResult {
  id: string;
  created_at: string;
  path: LearningPath;
  raw_thoughts: string;
}