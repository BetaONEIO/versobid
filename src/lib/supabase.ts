```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { mapSnakeToCamel, mapCamelToSnake } from './utils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const transformResponse = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(item => mapSnakeToCamel(item)) as T;
  }
  return mapSnakeToCamel(data) as T;
};

export const transformRequest = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(item => mapCamelToSnake(item)) as T;
  }
  return mapCamelToSnake(data) as T;
};
```