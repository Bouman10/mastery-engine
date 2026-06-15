export type Duration = 30 | 60 | 90;

export type Phase = "learn" | "build" | "refine";

export interface Track {
  id: string;
  user_id: string;
  skill: string;
  duration: Duration;
  goal: string;
  created_at: string;
  is_active: boolean;
}

export interface Cycle {
  id: string;
  track_id: string;
  user_id: string;
  cycle_number: number;
  submission?: string;
  score?: number;
  feedback?: CycleFeedback;
  completed_at: string;
}

export interface CycleFeedback {
  headline: string;
  strengths: string[];
  gaps: string[];
  pattern: string;
  next_cycle_focus: string;
  score: number;
}

export interface LearnContent {
  concept: string;
  why: string;
  fundamentals: { title: string; explanation: string }[];
  map: string;
  first_step: string;
}

export interface BuildChallenge {
  title: string;
  brief: string;
  requirements: string[];
  deliverable: string;
  time_estimate: string;
}

export interface FeaturedSkill {
  id: string;
  label: string;
  cat: string;
}
