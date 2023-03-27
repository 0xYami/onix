import { z, type ZodSchema } from 'zod';

export const addressDetailsSchema = z.object({
  address: z.string(),
  balance: z.object({
    token: z.string(),
    price: z.string(),
  }),
  assets: z.array(
    z.object({
      name: z.string(),
      balance: z.string(),
      symbol: z.string(),
    }),
  ),
});

export type AddressDetails = z.infer<typeof addressDetailsSchema>;

export { z };
export type { ZodSchema };
