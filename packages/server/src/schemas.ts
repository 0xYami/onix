import { z, networkName } from '@onix/schemas';

export const baseQuerySchema = z.object({
  network: networkName,
});

export const addressParamsSchema = z.object({
  address: z.string(),
});

export const userAssetParamsSchema = addressParamsSchema.extend({
  contractAddress: z.string(),
});

export const erc20ActivityParams = z.object({
  userAddress: z.string(),
  contractAddressOrSymbol: z.string(),
});
export type ERC20ActivityParams = z.infer<typeof erc20ActivityParams>;

export const nftQueryParamsSchema = userAssetParamsSchema.extend({
  tokenId: z.string(),
});
