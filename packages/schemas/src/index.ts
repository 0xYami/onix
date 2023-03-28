import { z, type ZodSchema } from 'zod';

const balanceSchema = z.object({
  token: z.string(),
  price: z.string(),
  value: z.string(),
});

export const addressDetailsSchema = z.object({
  address: z.string(),
  balance: z.string(),
  assets: z.array(
    z.object({
      name: z.string(),
      balance: balanceSchema,
      symbol: z.string(),
    }),
  ),
});

export type AddressDetails = z.infer<typeof addressDetailsSchema>;

export { z };
export type { ZodSchema };
