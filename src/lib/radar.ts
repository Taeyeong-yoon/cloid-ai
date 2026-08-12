import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { RadarPost } from './types';
export { formatDate } from './utils';

const radarDir = path.join(process.cwd(), 'content/radar');

type IndexEntry = RadarPost & { excerpt?: string; sourceUrl?: string; score?: number };

/**
 * RSS 스니펫에는 HTML 태그와 이스케이프된 엔티티가 섞여 들어온다.
 * 목록/상세에 그대로 노출되면 마크업이 글자로 보이므로 정리한다.
 */
function cleanSummary(raw: string): string {
  if (!raw) return '';
  const decoded = raw
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
  const stripped = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped.length > 180 ? `${stripped.slice(0, 180)}…` : stripped;
}

/**
 * 자동 수집된 md에는 category 프론트매터가 없어 전부 한 칸에 몰린다.
 * 제목·태그로 추론해 목록의 카테고리 아코디언이 실제로 동작하게 한다.
 * (TrendsClient의 CATEGORY_CONFIG 키와 일치해야 한다)
 */
function inferCategory(title: string, tags: string[]): string {
  const haystack = `${title} ${tags.join(' ')}`.toLowerCase();
  const has = (...words: string[]) => words.some((w) => haystack.includes(w));

  if (has('anthropic', 'claude')) return 'Anthropic';
  if (has('openai', 'gpt', 'sora', 'codex', 'chatgpt')) return 'OpenAI';
  if (has('google', 'gemini', 'veo', 'notebooklm', 'deepmind')) return 'Google';
  if (has('runway', 'midjourney', 'suno', 'pika', 'video', 'music', '영상', '음악')) {
    return 'Video & Music';
  }
  return 'Tools & Platforms';
}

function readIndex(): Map<string, IndexEntry> {
  const map = new Map<string, IndexEntry>();
  try {
    const raw = fs.readFileSync(path.join(radarDir, 'index.json'), 'utf-8');
    for (const entry of JSON.parse(raw) as IndexEntry[]) {
      map.set(entry.slug, entry);
    }
  } catch {
    // index.json이 없거나 깨져도 md 파일만으로 동작한다
  }
  return map;
}

/**
 * md 파일이 진실의 원천. index.json은 score·category 보강용으로만 쓴다.
 * (index.json은 상위 50개만 유지되므로 이것만 읽으면 대부분의 글이 사라진다)
 */
export function getAllRadarPosts(): RadarPost[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(radarDir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }

  const index = readIndex();
  const posts: RadarPost[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    try {
      const raw = fs.readFileSync(path.join(radarDir, file), 'utf-8');
      const { data } = matter(raw);
      const fromIndex = index.get(slug);
      const title = (data.title as string) ?? slug;
      const tags = (data.tags as string[]) ?? fromIndex?.tags ?? [];

      posts.push({
        slug,
        title,
        date: String(data.date ?? fromIndex?.date ?? ''),
        tags,
        summary: cleanSummary((data.summary as string) ?? fromIndex?.excerpt ?? ''),
        score: (data.score as number) ?? fromIndex?.score,
        sourceUrl: (data.sourceUrl as string) ?? fromIndex?.sourceUrl,
        category:
          (data.category as string) ?? fromIndex?.category ?? inferCategory(title, tags),
      });
    } catch {
      // 개별 파일 파싱 실패는 건너뛴다
    }
  }

  // 최신순 우선, 같은 날짜면 점수순
  return posts.sort((a, b) => b.date.localeCompare(a.date) || (b.score ?? 50) - (a.score ?? 50));
}

export function getRadarPost(slug: string): RadarPost | null {
  try {
    const raw = fs.readFileSync(path.join(radarDir, `${slug}.md`), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      date: String(data.date ?? ''),
      tags: (data.tags as string[]) ?? [],
      summary: cleanSummary((data.summary as string) ?? ''),
      score: data.score as number | undefined,
      sourceUrl: data.sourceUrl as string | undefined,
      category: data.category as string | undefined,
      content,
    };
  } catch {
    // md가 없으면 index.json 항목으로 대체
    const entry = readIndex().get(slug);
    if (!entry) return null;
    return {
      slug: entry.slug,
      title: entry.title,
      date: entry.date,
      tags: entry.tags ?? [],
      summary: cleanSummary(entry.summary ?? entry.excerpt ?? ''),
      score: entry.score,
      sourceUrl: entry.sourceUrl,
      category: entry.category,
      content: '',
    };
  }
}
