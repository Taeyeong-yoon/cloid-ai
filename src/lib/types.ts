export interface RadarPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;       // normalized: excerpt ?? summary
  score?: number;
  sourceUrl?: string;
  content?: string;
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

export interface Skill {
  slug: string;
  title: string;
  tags: string[];
  difficulty: string;
  summary: string;
  content: string;
}
