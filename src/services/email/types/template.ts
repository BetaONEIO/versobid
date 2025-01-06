import { TemplateName, EmailTemplateParams } from './templateParams';

export interface EmailTemplate<T extends TemplateName> {
  name: T;
  subject: string;
  getParams: (data: EmailTemplateParams[T]) => Record<string, string>;
}