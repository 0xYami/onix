import { z } from '@onix/schemas';

const schema = z.object({
  baseURL: z.string().url(),
  storageKey: z.string(),
});

const config = schema.parse({
  baseURL: import.meta.env.VITE_SERVER_HOST_URL,
  storageKey: import.meta.env.VITE_STORAGE_KEY,
});

export { config };
