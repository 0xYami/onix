import { z } from '@onix/schemas';

export const addressDetailsParams = z.object({
  address: z.string(),
});
