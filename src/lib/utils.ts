import { formatDistanceToNow } from 'date-fns';

export function formatTimestamp(date: string | Date, options?: Parameters<typeof formatDistanceToNow>[1]): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, ...options });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  return `${Math.random().toString(36).substring(2)}.${ext}`;
}