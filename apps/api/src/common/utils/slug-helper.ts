import { v4 as uuidv4 } from 'uuid';

export function createSlug(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return `${slug}_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
}
