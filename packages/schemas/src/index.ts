import { z, type ZodSchema } from 'zod';

const assetSymbolSchema = z.union([
  z.literal('ETH'),
  z.literal('USDT'),
  z.literal('USDC'),
  z.literal('DAI'),
  z.literal('MATIC'),
  z.literal('LINK'),
  z.literal('UNI'),
  z.literal('LDO'),
  z.literal('MKR'),
  z.literal('AAVE'),
  z.literal('APE'),
]);

const assetBalanceSchema = z.object({
  token: z.string(),
  usd: z.string(),
});

export const addressDetailsSchema = z.object({
  address: z.string(),
  etherBalance: assetBalanceSchema,
  totalBalance: z.string(),
  assets: z.array(
    z.object({
      name: z.string(),
      symbol: assetSymbolSchema,
      address: z.string(),
      balance: assetBalanceSchema,
    }),
  ),
});

export const transfersSchema = z.array(
  z.object({
    blockNumber: z.string(),
    timeStamp: z.string(),
    hash: z.string(),
    nonce: z.string(),
    blockHash: z.string(),
    from: z.string(),
    contractAddress: z.string(),
    to: z.string(),
    value: z.string(),
    tokenName: z.string(),
    tokenSymbol: z.string(),
    tokenDecimal: z.string(),
    transactionIndex: z.string(),
    gas: z.string(),
    gasPrice: z.string(),
    gasUsed: z.string(),
    cumulativeGasUsed: z.string(),
    confirmations: z.string(),
  }),
);

export const getAssetResultSchema = z.object({
  name: z.string(),
  symbol: assetSymbolSchema,
  address: z.string(),
  balance: assetBalanceSchema,
  transfers: transfersSchema,
});

export type GetAssetResult = z.infer<typeof getAssetResultSchema>;
export type Transfers = z.infer<typeof transfersSchema>;
export type AddressDetails = z.infer<typeof addressDetailsSchema>;

export { z };
export type { ZodSchema };
