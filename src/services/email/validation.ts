import { EmailOptions } from './types';

export const validateEmailRequest = (options: EmailOptions): string[] => {
  const errors: string[] = [];

  if (!options.to || !options.to.includes('@')) {
    errors.push('Invalid recipient email address');
  }

  if (!options.subject) {
    errors.push('Email subject is required');
  }

  if (!options.templateName) {
    errors.push('Email template name is required');
  }

  return errors;
};