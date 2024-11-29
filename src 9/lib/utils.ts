```typescript
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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const mapSnakeToCamel = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  });
  return newObj;
};

export const mapCamelToSnake = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  });
  return newObj;
};
```