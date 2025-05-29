import { Badge } from '@/components/ui/badge';
import { darkThemeColors } from '@/lib/const';
import { Tag } from 'lucide-react';

export function Label({ color, name }: { color: string; name: string }) {
  const theme = darkThemeColors[color];
  return (
    <Badge
      style={{ backgroundColor: theme.bg, color: theme.text }}
      className='text-xs'
    >
      <Tag className='size-4' style={{ color: theme.text }} />
      {name}
    </Badge>
  );
}
