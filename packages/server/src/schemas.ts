import { z } from '@onix/schemas';

export const addressParamsSchema = z.object({
  address: z.string(),
});

export const userAssetParamsSchema = addressParamsSchema.extend({
  contractAddress: z.string(),
});

export const nftQueryParamsSchema = userAssetParamsSchema.extend({
  tokenId: z.string(),
})
