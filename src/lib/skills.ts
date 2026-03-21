import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Skill } from './types';

const skillsDir = path.join(process.cwd(), 'content/skills');

export function getAllSkills(): Skill[] {
  try {
    const files = fs.readdirSync(skillsDir).filter((f) => f.endsWith('.md'));
    return files.map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(skillsDir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title as string,
        tags: (data.tags as string[]) ?? [],
        difficulty: (data.difficulty as string) ?? 'beginner',
        summary: data.summary as string,
        content,
        category: (data.category as 'features' | 'usecases') ?? 'features',
        updated: data.updated ? String(data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated) : undefined,
      };
    });
  } catch {
    return [];
  }
}

export function getSkill(slug: string): Skill | null {
  try {
    const filePath = path.join(skillsDir, `${slug}.md`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      tags: (data.tags as string[]) ?? [],
      difficulty: (data.difficulty as string) ?? 'beginner',
      summary: data.summary as string,
      content,
      category: (data.category as 'features' | 'usecases') ?? 'features',
      updated: data.updated ? String(data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated) : undefined,
    };
  } catch {
    return null;
  }
}
