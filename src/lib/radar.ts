import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { RadarPost } from './types';
export { formatDate } from './utils';

const radarDir = path.join(process.cwd(), 'content/radar');

type IndexEntry = RadarPost & { excerpt?: string; sourceUrl?: string; score?: number };

export function getAllRadarPosts(): RadarPost[] {
  try {
    const indexPath = path.join(radarDir, 'index.json');
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const entries: IndexEntry[] = JSON.parse(raw);
    return entries
      .map((e) => ({
        slug: e.slug,
        title: e.title,
        date: e.date,
        tags: e.tags ?? [],
        summary: e.summary ?? e.excerpt ?? '',
        score: e.score,
        sourceUrl: e.sourceUrl,
        category: e.category,
      }))
      .sort((a, b) => (b.score ?? 50) - (a.score ?? 50) || b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function getRadarPost(slug: string): RadarPost | null {
  // 1. Try reading the .md file
  try {
    const filePath = path.join(radarDir, `${slug}.md`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      tags: (data.tags as string[]) ?? [],
      summary: (data.summary as string) ?? '',
      score: data.score as number | undefined,
      sourceUrl: data.sourceUrl as string | undefined,
      category: data.category as string | undefined,
      content,
    };
  } catch {
    // 2. Fall back to index.json entry
    try {
      const indexPath = path.join(radarDir, 'index.json');
      const raw = fs.readFileSync(indexPath, 'utf-8');
      const entries: IndexEntry[] = JSON.parse(raw);
      const entry = entries.find((e) => e.slug === slug);
      if (!entry) return null;
      return {
        slug: entry.slug,
        title: entry.title,
        date: entry.date,
        tags: entry.tags ?? [],
        summary: entry.summary ?? entry.excerpt ?? '',
        score: entry.score,
        sourceUrl: entry.sourceUrl,
        category: entry.category,
        content: '',
      };
    } catch {
      return null;
    }
  }
}
