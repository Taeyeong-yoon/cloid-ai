'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type BookmarkType = 'radar' | 'skill';

export interface Bookmark {
  id: string;
  slug: string;
  type: BookmarkType;
  created_at: string;
}

export async function addBookmark(slug: string, type: BookmarkType) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { error } = await supabase
    .from('bookmarks')
    .insert({ user_id: user.id, slug, type });

  if (error) return { error: error.message };
  revalidatePath('/account');
  return { success: true };
}

export async function removeBookmark(slug: string, type: BookmarkType) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('slug', slug)
    .eq('type', type);

  if (error) return { error: error.message };
  revalidatePath('/account');
  return { success: true };
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (data ?? []) as Bookmark[];
}

export async function getUserBookmarkSlugs(): Promise<Set<string>> {
  const bookmarks = await getBookmarks();
  return new Set(bookmarks.map((b) => `${b.type}:${b.slug}`));
}
