import { formatDistanceToNow, format } from 'date-fns';

export const formatTimestamp = (date: string | Date | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatDate = (date: string | Date | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'PPP');
};