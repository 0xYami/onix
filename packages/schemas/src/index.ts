import { z, type ZodSchema } from 'zod';

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
      symbol: z.string(),
      address: z.string(),
      balance: assetBalanceSchema,
    }),
  ),
});

export type AddressDetails = z.infer<typeof addressDetailsSchema>;

export { z };
export type { ZodSchema };
