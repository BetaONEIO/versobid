var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\nimport { createClient } from '@supabase/supabase-js';\nimport { Database } from '../types/database';\nimport { mapSnakeToCamel, mapCamelToSnake } from './utils';\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL;\nconst supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;\n\nif (!supabaseUrl || !supabaseKey) {\n  throw new Error('Missing Supabase environment variables');\n}\n\nexport const supabase = createClient<Database>(supabaseUrl, supabaseKey);\n\nexport const transformResponse = <T>(data: T): T => {\n  if (Array.isArray(data)) {\n    return data.map(item => mapSnakeToCamel(item)) as T;\n  }\n  return mapSnakeToCamel(data) as T;\n};\n\nexport const transformRequest = <T>(data: T): T => {\n  if (Array.isArray(data)) {\n    return data.map(item => mapCamelToSnake(item)) as T;\n  }\n  return mapCamelToSnake(data) as T;\n};\n"], ["typescript\nimport { createClient } from '@supabase/supabase-js';\nimport { Database } from '../types/database';\nimport { mapSnakeToCamel, mapCamelToSnake } from './utils';\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL;\nconst supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;\n\nif (!supabaseUrl || !supabaseKey) {\n  throw new Error('Missing Supabase environment variables');\n}\n\nexport const supabase = createClient<Database>(supabaseUrl, supabaseKey);\n\nexport const transformResponse = <T>(data: T): T => {\n  if (Array.isArray(data)) {\n    return data.map(item => mapSnakeToCamel(item)) as T;\n  }\n  return mapSnakeToCamel(data) as T;\n};\n\nexport const transformRequest = <T>(data: T): T => {\n  if (Array.isArray(data)) {\n    return data.map(item => mapCamelToSnake(item)) as T;\n  }\n  return mapCamelToSnake(data) as T;\n};\n"]))(__makeTemplateObject([""], [""]));