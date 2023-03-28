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

export type AddressDetails = z.infer<typeof addressDetailsSchema>;

export { z };
export type { ZodSchema };
