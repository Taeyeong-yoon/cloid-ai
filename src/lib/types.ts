export interface RadarPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;       // normalized: excerpt ?? summary
  score?: number;
  sourceUrl?: string;
  content?: string;
  category?: string;
}

export interface LearningResource {
  type: 'doc' | 'video' | 'practice';
  title: string;
  url?: string;
  search_keyword?: string;
  description?: string;
  command?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  resources: LearningResource[];
}

export interface LabStep {
  step: number;
  title: string;
  instruction: string;
  prompt?: string;
  expected_result?: string;
  tip?: string;
}

export interface LabVideo {
  title: string;
  search_keyword: string;
  url: string;
}

export interface LabItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  tags: string[];
  steps: LabStep[];
  challenge?: string;
  related_skills?: string[];
  videos?: LabVideo[];
}

export interface Skill {
  slug: string;
  title: string;
  tags: string[];
  difficulty: string;
  summary: string;
  content: string;
}
