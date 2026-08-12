import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Skill } from './types';

const skillsDir = path.join(process.cwd(), 'content/skills');

export function getAllSkills(): Skill[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(skillsDir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }

  // 주의: 파싱을 파일 단위로 감싼다.
  // 전체를 하나의 try/catch로 묶으면 프론트매터가 깨진 파일 하나 때문에
  // 목록 전체가 빈 배열이 되어 허브가 통째로 사라진다.
  const skills: Skill[] = [];
  for (const file of files) {
    try {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(skillsDir, file), 'utf-8');
      const { data, content } = matter(raw);
      if (!data.title) continue;

      skills.push({
        slug,
        title: data.title as string,
        tags: (data.tags as string[]) ?? [],
        difficulty: (data.difficulty as string) ?? 'beginner',
        summary: (data.summary as string) ?? '',
        content,
        category: (data.category as 'features' | 'usecases') ?? 'features',
        updated: data.updated
          ? String(data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated)
          : undefined,
      });
    } catch {
      // 개별 파일 파싱 실패는 건너뛴다
    }
  }
  return skills;
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
