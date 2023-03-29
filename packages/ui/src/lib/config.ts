import { z } from '@onix/schemas';

const schema = z.object({
  baseURL: z.string().url(),
});

const config = schema.parse({
  baseURL: import.meta.env.VITE_SERVER_HOST_URL,
});

export { config };
