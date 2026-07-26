import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return format(d, formatStr);
}

export function formatFromNow(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return formatDistanceToNow(d, { addSuffix: true });
}
