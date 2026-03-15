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

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface EvaluationConfig {
  prompt: string;
  context: string;
  successCriteria: string[];
  commonMistakes: string[];
}

export interface PracticePrompt {
  label: string;
  instruction: string;
  prompt: string;
  followUp?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  resources: LearningResource[];
  quiz?: QuizQuestion[];
  evaluation?: EvaluationConfig;
  practicePrompts?: PracticePrompt[];
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

export interface ChallengeTestCase {
  input: string;
  expected: string;
}

export interface CodeChallengeData {
  title: string;
  description: string;
  language: 'python';
  starterCode: string;
  solution: string;
  testCases: ChallengeTestCase[];
  hints: string[];
}

export interface LabItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  tags: string[];
  steps: LabStep[];
  challenge?: string | CodeChallengeData;
  related_skills?: string[];
  videos?: LabVideo[];
  evaluation?: EvaluationConfig;
  practicePrompts?: PracticePrompt[];
}

export interface Skill {
  slug: string;
  title: string;
  tags: string[];
  difficulty: string;
  summary: string;
  content: string;
}
