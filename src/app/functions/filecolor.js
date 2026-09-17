import ANSI from '@/app/components/ANSI.json'

export function fileColor(name, type) {
  if (type === 'dir') return ANSI.cyan;
  if (name.endsWith('.md')) return ANSI.green;
  if (name.endsWith('.txt')) return ANSI.yellow;
  if (name.endsWith('.sh')) return ANSI.orange;
  return ANSI.white;
}