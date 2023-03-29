import { z } from '@onix/schemas';

export const addressParamsSchema = z.object({
  address: z.string(),
});

export const userAssetParamsSchema = z.object({
  address: z.string(),
  contractAddress: z.string(),
});
