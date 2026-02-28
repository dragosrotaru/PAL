import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const NOTES_DIR = path.join(ROOT, 'notes');
const EXCLUDE = new Set(['INDEX.md', 'TAGS.md']);

interface Note {
  filename: string;
  date: string;
  tags: string[];
  summary: string;
}

function parseFrontmatter(content: string): Omit<Note, 'filename'> | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = match[1];

  const date    = fm.match(/^date:\s*(.+)$/m)?.[1]?.trim() ?? 'unknown';
  const tagsRaw = fm.match(/^tags:\s*\[(.+)\]$/m)?.[1] ?? '';
  const summary = fm.match(/^summary:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const tags    = tagsRaw.split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);

  return { date, tags, summary };
}

function trunc(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// ── Collect ───────────────────────────────────────────────────────────────────

const notes: Note[] = fs.readdirSync(NOTES_DIR)
  .filter(f => f.endsWith('.md') && !EXCLUDE.has(f))
  .sort()
  .flatMap(filename => {
    const content = fs.readFileSync(path.join(NOTES_DIR, filename), 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) { console.warn(`  skip (no frontmatter): ${filename}`); return []; }
    return [{ filename, ...fm }];
  });

const generated = new Date().toISOString().slice(0, 10);

// ── INDEX.md ──────────────────────────────────────────────────────────────────

const indexLines: string[] = [
  '# Notes Index',
  '',
  `_${generated} · ${notes.length} notes_`,
  '',
];

for (const { filename, date, tags, summary } of notes) {
  indexLines.push(`### ${filename}`);
  indexLines.push(`\`${date}\` · ${tags.slice(0, 5).join(', ')}`);
  indexLines.push(trunc(summary, 220));
  indexLines.push('');
}

fs.writeFileSync(path.join(ROOT, 'INDEX.md'), indexLines.join('\n'));
console.log(`✓ INDEX.md  (${notes.length} notes)`);

// ── TAGS.md ───────────────────────────────────────────────────────────────────

const tagMap = new Map<string, string[]>();
for (const { filename, tags } of notes) {
  for (const tag of tags) {
    if (!tagMap.has(tag)) tagMap.set(tag, []);
    tagMap.get(tag)!.push(filename);
  }
}

const sortedTags = [...tagMap.keys()].filter(t => tagMap.get(t)!.length >= 2).sort();

const tagsLines: string[] = [
  '# Tag Clusters',
  '',
  `_${generated} · ${sortedTags.length} shared tags · ${notes.length} notes_`,
  '',
];

for (const tag of sortedTags) {
  tagsLines.push(`## ${tag}`);
  tagMap.get(tag)!.sort().forEach(f => tagsLines.push(`- ${f}`));
  tagsLines.push('');
}

fs.writeFileSync(path.join(ROOT, 'TAGS.md'), tagsLines.join('\n'));
console.log(`✓ TAGS.md   (${sortedTags.length} tags)`);
