import fs from 'fs';
import path from 'path';
import type { LearningTopic } from './types';

const learningDir = path.join(process.cwd(), 'content/learning');

export function getAllTopics(): LearningTopic[] {
  try {
    const files = fs.readdirSync(learningDir).filter((f) => f.endsWith('.json'));
    return files.map((file) => {
      const raw = fs.readFileSync(path.join(learningDir, file), 'utf-8');
      return JSON.parse(raw) as LearningTopic;
    });
  } catch {
    return [];
  }
}

export function getTopic(id: string): LearningTopic | null {
  try {
    const filePath = path.join(learningDir, `${id}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as LearningTopic;
  } catch {
    return null;
  }
}
