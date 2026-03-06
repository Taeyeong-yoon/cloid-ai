import fs from 'fs';
import path from 'path';
import type { LabItem } from './types';

const labsDir = path.join(process.cwd(), 'content/labs');

export function getAllLabs(): LabItem[] {
  try {
    const files = fs.readdirSync(labsDir).filter((f) => f.endsWith('.json'));
    return files.map((file) => {
      const raw = fs.readFileSync(path.join(labsDir, file), 'utf-8');
      return JSON.parse(raw) as LabItem;
    });
  } catch {
    return [];
  }
}

export function getLab(id: string): LabItem | null {
  try {
    const filePath = path.join(labsDir, `${id}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as LabItem;
  } catch {
    return null;
  }
}
